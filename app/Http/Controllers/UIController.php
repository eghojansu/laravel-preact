<?php

namespace App\Http\Controllers;

use App\Models\User;

class UIController extends Controller
{
    public function home()
    {
        /** @var User|null */
        $user = auth()->user();
        $data = collect(config('app'))
            ->merge(array(
                'user' => $user?->publish(),
            ))
            ->only(
                'user',
                'name',
                'desc',
                'owner',
                'year',
                'home',
            )->toArray()
        ;

        return view('ui.home', compact('data'));
    }
}
