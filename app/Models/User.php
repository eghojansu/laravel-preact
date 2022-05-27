<?php

namespace App\Models;

use App\Extended\Model;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Auth\MustVerifyEmail;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Contracts\Auth\CanResetPassword;
use Illuminate\Contracts\Auth\Access\Authorizable;
use Illuminate\Auth\Authenticatable as AuthAuthenticatable;
use Illuminate\Foundation\Auth\Access\Authorizable as AccessAuthorizable;
use Illuminate\Auth\Passwords\CanResetPassword as PasswordsCanResetPassword;

class User extends Model implements Authenticatable, Authorizable, CanResetPassword
{
    use
        HasApiTokens,
        Notifiable,
        AuthAuthenticatable,
        AccessAuthorizable,
        PasswordsCanResetPassword,
        MustVerifyEmail;

    protected $table = 'users';
    protected $fillable = array(
        'userid',
        'name',
        'email',
        'password',
        'active',
        'joindt',
    );
    protected $hidden = array(
        'password',
        'remember_token',
        'email_verified_at',
    );
    protected $casts = array(
        'email_verified_at' => 'datetime',
        'joindt' => 'datetime',
    );
    private $permissionsCache = array();

    public function publish(): array
    {
        return $this->only('name', 'email');
    }

    public function allowed(string ...$permissions): bool
    {
        if (array_intersect($this->permissionsCache, $permissions)) {
            return true;
        }

        array_push(
            $this->permissionsCache,
            ...$this->roles->reduce(
                static function (array $perms, Acrole $role) {
                    array_push(
                        $perms,
                        ...$role->perms->map(
                            static fn (Acperm $perm) => $perm->permid,
                        )->toArray(),
                    );

                    return $perms;
                },
                array(),
            ),
        );

        return !!array_intersect($this->permissionsCache, $permissions);
    }

    public function roles()
    {
        return $this->belongsToMany(
            Acrole::class,
            'usrole',
            'userid',
            'roleid',
            'userid',
            'roleid',
        );
    }

    public function attempts()
    {
        return $this->hasMany(Usatt::class, 'userid', 'userid');
    }

    public function activities()
    {
        return $this->hasMany(Usact::class, 'userid', 'userid');
    }

    public function getActiveAttempt(string $ip, string $agent): Usatt|null
    {
        return $this->attempts()->where('active', 1)->where('ip', $ip)->where('agent', $agent)->first();
    }

    public function newAttempt(int $attleft, string $ip, string $agent): Usatt
    {
        $attempt = new Usatt(compact('attleft', 'ip', 'agent') + array(
            'active' => 1,
        ));

        $this->attempts()->save($attempt);

        return $attempt;
    }
}
