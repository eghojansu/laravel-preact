<?php

namespace App\Http\Controllers\Api;

use App\Service\Account;

class MainController extends Controller
{
    public function login(Account $account)
    {
        $data = $this->validateWith(array(
            'username' => 'required|string',
            'password' => 'required|string',
            'remember' => 'nullable',
        ));

        return $account->attempt(
            $data['username'],
            $data['password'],
            $data['remember'],
        );
    }
}
