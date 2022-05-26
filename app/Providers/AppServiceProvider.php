<?php

namespace App\Providers;

use App\Extended\Blueprint as ExtendedBlueprint;
use App\Service\Api;
use App\Service\Auditable;
use App\Service\Preference;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->singleton(Api::class);
        $this->app->singleton(Auditable::class);
        $this->app->singleton(Preference::class);

        $this->app->bind(Blueprint::class, ExtendedBlueprint::class);
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        Schema::defaultStringLength(64);
    }
}
