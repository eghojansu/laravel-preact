<?php

namespace App\Services;

use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class Menu
{
    public function getMenu(string $group): array
    {
        $rows = DB::table('menus')
            ->where('group', $group)
            ->where('active', 1)
            ->orderBy('position')
            ->get()
            ->map(static fn ($row) => (array) $row)
            ->toArray()
        ;

        return self::buildMenu($rows);
    }

    public function flatten(array $baseMenu, string $group): array
    {
        $pos = 0;
        $add = static function () use ($group, &$pos) {
            $pos++;

            return compact('group', 'pos');
        };

        /** @var array */
        $flatten = collect($baseMenu)->reduce(static fn (array $rows, array $menu, string $id) => array_merge(
            $rows,
            self::getFlattenMenu($menu, $id, $add),
        ), array());

        return $flatten;
    }

    private static function getFlattenMenu(array $menu, string $id, \Closure $add, array $parent = null): array
    {
        /** @var array */
        $flatten = collect($menu['items'] ?? array())->reduce(
            static fn (array $flatten, array $menu, string $id) => array_merge(
                $flatten,
                self::getFlattenMenu($menu, $id, $add, $flatten[0]),
            ),
            array(self::getMenuRow($menu + $add(), $id, $parent)),
        );

        return $flatten;
    }

    private static function getMenuRow(array $menu, string $id, array $parent = null): array
    {
        return array(
            'menuid' => $id,
            'label' => $menu['label'] ?? Str::title($id),
            'path' => $menu['path'] ?? '#',
            'group' => $menu['group'] ?? null,
            'position' => $menu['pos'] ?? null,
            'icon' => $menu['icon'] ?? null,
            'active' => 1,
            'roles' => isset($menu['roles']) ? json_encode($menu['roles']) : null,
            'payload' => isset($menu['data']) ? json_encode($menu['data']) : null,
            'parent' => $parent['menuid'] ?? null,
        );
    }

    private static function buildMenu(array $rows): array
    {
        return array_reduce(
            $rows,
            static function (array $menu, array $row) {
                if ($row['data']) {
                    $row['data'] = json_decode($row['data']);
                }

                if (isset($row['parent'])) {
                    $parent = &self::getParent($menu, $row['parent']);

                    if (null === $parent) {
                        $parent = &$menu[count($menu)];
                    }

                    $parent['items'][] = array_filter($row);
                } else {
                    $menu[] = array_filter($row);
                }

                return $menu;
            },
            array(),
        );
    }

    private static function &getParent(array &$menu, string $parent): array|null
    {
        foreach ($menu as &$row) {
            if ($parent === $row['id']) {
                return $row;
            } elseif (isset($row['items']) && $found = &self::getParent($row['items'], $parent)) {
                return $found;
            }
        }

        $null = null;

        return $null;
    }
}
