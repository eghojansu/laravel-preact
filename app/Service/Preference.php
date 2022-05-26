<?php

namespace App\Service;

use App\Models\Cspref;

class Preference
{
    public $maxAttempt = 3;

    public function __construct()
    {
        $this->loadPreferences();
    }

    public function loadPreferences(): static
    {
        Cspref::all()->each(function (Cspref $pref) {
            $name = $pref->name;

            $this->$name = $pref->content ? $pref->content['value'] : null;
        });

        return $this;
    }
}
