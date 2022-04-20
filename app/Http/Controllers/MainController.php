<?php

namespace App\Http\Controllers;

class MainController
{
    public function home()
    {
        return self::serve('frontend');
    }

    public function administration()
    {
        return self::serve('backend');
    }

    private static function serve(string $view)
    {
        $env = collect(config('app'))->only('name', 'alias', 'owner');

        return view($view, compact('env'));
    }
}
