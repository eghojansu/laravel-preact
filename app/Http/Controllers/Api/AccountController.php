<?php

namespace App\Http\Controllers\Api;

use App\Service\Menu;

class AccountController extends Controller
{
    public function menu(Menu $menu)
    {
        $groups = request()->get('groups') ?? array();
        $data = $groups ? $menu->getTree(...$groups) : null;

        return $this->api->data($data);
    }

    public function logout()
    {
        auth('web')->logout();

        return $this->api->ok('account.out');
    }
}
