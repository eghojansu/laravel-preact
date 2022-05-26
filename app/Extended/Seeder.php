<?php

namespace App\Extended;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder as DatabaseSeeder;

abstract class Seeder extends DatabaseSeeder
{
    use WithoutModelEvents;

    public static function getOrder(): int
    {
        return 0;
    }
}
