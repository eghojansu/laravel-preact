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
        Schema::create('usrole', function (Blueprint $table) {
            $table->id();
            $table->userid();
            $table->forid('roleid', 32);
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
        Schema::dropIfExists('usrole');
    }
};
