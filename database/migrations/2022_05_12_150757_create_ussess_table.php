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
        Schema::create('ussess', function (Blueprint $table) {
            $table->id();
            $table->audid('sessid', 32);
            $table->userid();
            $table->activable();
            $table->recordable();
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
        Schema::dropIfExists('ussess');
    }
};
