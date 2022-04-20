<?php

namespace Database\Seeders;

use App\Services\Menu;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function __construct(
        private Menu $menu,
    ) {}

    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->loadUsers();
        $this->loadMenus();
        // \App\Models\User::factory(10)->create();
    }

    private function loadMenus(): void
    {
        $dir = dirname(__DIR__) . '/seeds/';
        $ext = '-menu.php';
        $menus = array(
            'back',
        );
        $table = DB::table('menus');

        array_walk($menus, fn (string $menu) => $table->insert($this->menu->flatten(require $dir . $menu . $ext, $menu)));
    }

    private function loadUsers(): void
    {
        $table = DB::table('users');

        $table->insert(array(
            array(
                'userid' => 'su',
                'name' => 'Administrator',
                'email' => 'su@root.com',
                'password' => Hash::make('admin123'),
                'roles' => '["su","admin"]',
            ),
        ));
    }
}
