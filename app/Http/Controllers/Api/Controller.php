<?php

namespace App\Http\Controllers\Api;

use App\Service\Api;
use App\Http\Controllers\Controller as ControllersController;

abstract class Controller extends ControllersController
{
    public function __construct(
        protected Api $api,
    ) {
        $this->init();
    }

    protected function init()
    {}
}
