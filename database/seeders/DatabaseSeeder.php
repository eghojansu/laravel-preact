<?php

namespace Database\Seeders;

use App\Extended\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->seedSources();
        $this->seedAll();
    }

    private function seedSources(): void
    {
        /** @var \PDO */
        $conn = DB::getPdo();
        $sources = glob(database_path('imports/*.sql'));

        array_walk(
            $sources,
            static fn (string $source) => $conn->exec(file_get_contents($source)),
        );
    }

    private function seedAll(): void
    {
        $seeds = array_map(
            static fn (string $file) => 'Database\\Seeders\\' . basename($file, '.php'),
            array_filter(
                glob(__DIR__ . DIRECTORY_SEPARATOR . '*Seeder.php'),
                static fn (string $file) => $file !== __FILE__,
            ),
        );

        usort(
            $seeds,
            static fn (string $a, string $b) => $b::getOrder() <=> $a::getOrder(),
        );

        $this->call($seeds);
    }
}
