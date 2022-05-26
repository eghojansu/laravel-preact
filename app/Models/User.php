<?php

namespace App\Models;

use App\Extended\Model;
use Illuminate\Auth\Authenticatable as AuthAuthenticatable;
use Illuminate\Auth\MustVerifyEmail;
use Illuminate\Auth\Passwords\CanResetPassword as PasswordsCanResetPassword;
use Illuminate\Contracts\Auth\Access\Authorizable;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Contracts\Auth\CanResetPassword;
use Illuminate\Foundation\Auth\Access\Authorizable as AccessAuthorizable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;

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
}
