<?php

namespace App\Providers;

use App\Database\Blueprint;
use Illuminate\Database\Schema\Blueprint as SchemaBlueprint;
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
        $this->app->bind(SchemaBlueprint::class, Blueprint::class);
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
    }
}
