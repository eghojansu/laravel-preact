<?php

namespace App\Service;

use App\Models\Usact;
use App\Models\User;
use App\Service\Api;
use App\Models\Usatt;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class Account
{
    public function __construct(
        private Api $api,
        private Preference $preference,
    ) {}

    public function record(
        string $activity,
        array $payload = null,
        bool $active = false,
    ): Usact {
        /** @var User */
        $user = Auth::user();
        $request = request();
        $activity = new Usact(array(
            'activity' => $activity,
            'payload' => $payload,
            'ip' => $request->ip(),
            'agent' => $request->userAgent(),
            'active' => $active,
        ));

        if ($user) {
            $user->activities()->save($activity);
        } else {
            $activity->save();
        }

        return $activity;
    }

    public function attempt(
        string $username,
        string $password,
        bool $remember = null,
    ): array {
        $field = filter_var($username, FILTER_VALIDATE_EMAIL) ? 'email' : 'userid';

        /** @var User */
        $user = User::where($field, $username)->first();

        if (!$user) {
            return $this->api->fail('account.invalid');
        }

        $request = request();
        $attempt = $user->getActiveAttempt($request->ip(), $request->userAgent());

        if ($attempt?->isLocked()) {
            return $this->api->fail(
                sprintf(
                    '%s (%s)',
                    trans('account.locked'),
                    trans('account.attempt_next', array('at' => $attempt->attnext->format('D, d M Y H:i:s'))),
                ),
            );
        }

        if (!Hash::check($password, $user->getAuthPassword())) {
            if (!$attempt) {
                $attempt = $user->newAttempt(
                    $this->preference->attMax,
                    $request->ip(),
                    $request->userAgent(),
                );
            }

            $attempt->increase($this->preference->attMax, $this->preference->attTo);

            return $this->api->fail(
                sprintf(
                    '%s (%s)',
                    trans('account.invalid'),
                    trans('account.attempt', array('left' => $attempt->attleft)),
                ),
            );
        }

        $attempt?->deactivate();

        if (!$user->active) {
            return $this->api->fail('account.inactive');
        }

        Auth::login($user, $remember);
        $this->record('login');

        return $this->api->ok('account.welcome', $user->publish());
    }
}
