<?php

namespace Database\Seeders;

use App\Models\User;
use App\Extended\Seeder;
use App\Models\Usrole;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        User::upsert(array(
            array(
                'name' => 'su',
                'userid' => 'su',
                'email' => 'su@root.com',
                'password' => Hash::make('admin123'),
                'active' => 1,
                'joindt' => now(),
            ),
        ), array('userid'), array('password'));
        Usrole::upsert(array(
            array('userid' => 'su', 'roleid' => 'su'),
        ), array('userid', 'roleid'));
    }
}
