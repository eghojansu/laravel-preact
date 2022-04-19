<?php

use App\Database\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('menus', function (Blueprint $table) {
            $table->id();
            $table->auditable('menuid');
            $table->string('label', 64);
            $table->string('path', 128);
            $table->string('parent', 8)->nullable();
            $table->string('group', 8)->nullable();
            $table->string('icon', 32)->nullable();
            $table->json('roles')->nullable();
            $table->json('payload')->nullable();
            $table->boolean('active')->nullable();
            $table->smallInteger('position')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('menus');
    }
};
