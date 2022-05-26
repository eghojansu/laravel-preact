<?php

use App\Extended\Blueprint;
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
        Schema::create('csmenu', function (Blueprint $table) {
            $table->id();
            $table->audid('menuid');
            $table->string('label', 64);
            $table->string('route', 128)->nullable();
            $table->json('args')->nullable();
            $table->string('url', 128)->nullable();
            $table->string('icon', 64)->nullable();
            $table->string('grp', 8)->nullable();
            $table->string('perm', 64)->nullable();
            $table->json('attrs')->nullable();
            $table->gradeable();
            $table->treeable();
            $table->activable();
            $table->auditable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('csmenu');
    }
};
