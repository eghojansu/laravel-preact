<?php

namespace App\Http\Controllers;

class MainController
{
    public function home()
    {
        $env = collect(config('app'))->only('name', 'alias', 'owner');

        return view('client', compact('env'));
    }
}
