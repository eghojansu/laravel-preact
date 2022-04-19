<?php

namespace App\Http\Controllers\API;

use App\Models\User;
use App\Http\Controllers\API\Concerns\API;

class AccountController
{
    use API;

    public function login()
    {
        $credentials = request()->validate(array(
            'email' => array('required', 'email'),
            'password' => array('required'),
        ));

        if (auth()->attempt($credentials)) {
            /** @var User */
            $user = auth()->user();

            return $this->json(array(
                'name' => $user->name,
                'roles' => $user->current_roles,
            ), 'Welcome');
        }

        return $this->failed(null, 'Invalid credentials');
    }
}
