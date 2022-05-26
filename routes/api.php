<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::namespace('App\\Http\\Controllers\\Api')->middleware('visit')->group(function() {
    Route::controller('MainController')->group(function() {
        Route::post('login', 'login');
    });

    Route::middleware('auth:sanctum')->group(function() {
        Route::controller('AccountController')->group(function() {
            Route::get('menu', 'menu');
            Route::post('logout', 'logout');
        });

        Route::prefix('adm')->group(function() {
            Route::controller('UserController')->prefix('user')->group(function() {
                Route::get('', 'home');
                Route::post('', 'create');
                Route::put('{id}', 'update');
                Route::delete('{id}', 'delete');
            });
        });
    });
});
