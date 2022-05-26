<?php

namespace Database\Seeders;

use App\Extended\Seeder;
use App\Models\Acperm;
use App\Models\Acrole;
use App\Models\Acrolep;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $perms = cconst(Acperm::class, 'PERM_');
        $su = array('roleid' => 'su');

        Acrole::upsert(array(
            $su,
        ), array('roleid'));
        Acperm::upsert(array_reduce(
            $perms,
            static fn (array|null $rows, string $permid) => array_merge(
                $rows ?? array(),
                array(compact('permid')),
            ),
        ), array('permid'));
        Acrolep::upsert(array_reduce(
            $perms,
            static fn (array|null $rows, string $permid) => array_merge(
                $rows ?? array(),
                array($su + compact('permid')),
            ),
        ), array('roleid', 'permid'));
    }
}
