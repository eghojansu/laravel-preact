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
        Schema::create('usact', function (Blueprint $table) {
            $table->id();
            $table->audid();
            $table->string('activity');
            $table->userid()->nullable();
            $table->recordable();
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
        Schema::dropIfExists('usact');
    }
};
