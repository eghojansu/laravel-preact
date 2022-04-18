<?php

namespace App\Services;

class Menu
{
    public function getMenu(string $group): array
    {
        $rows = $this->db->select(
            'MENU',
            array('GRP = ? AND ACTIVE = 1', $group),
            array(
                'columns' => array(
                    'id' => 'MENUID',
                    'label' => 'LABEL',
                    'path' => 'PTH',
                    'roles' => 'ROLES',
                    'data' => 'PAYLOAD',
                    'icon' => 'ICON',
                    'parent' => 'PARENT',
                ),
                'orders' => 'POS',
            ),
        );

        return self::buildMenu($rows);
    }

    public function flatten(array $baseMenu, string $group): array
    {
        $pos = 0;
        $add = static function () use ($group, &$pos) {
            $pos++;

            return compact('group', 'pos');
        };

        return Arr::reduce($baseMenu, static fn (array $rows, array $menu, string $id) => array_merge(
            $rows,
            self::getFlattenMenu($menu, $id, $add),
        ), array());
    }

    private static function getFlattenMenu(array $menu, string $id, \Closure $add, array $parent = null): array
    {
        return Arr::reduce(
            $menu['items'] ?? array(),
            static fn (array $flatten, array $menu, string $id) => array_merge(
                $flatten,
                self::getFlattenMenu($menu, $id, $add, $flatten[0]),
            ),
            array(self::getMenuRow($menu + $add(), $id, $parent)),
        );
    }

    private static function getMenuRow(array $menu, string $id, array $parent = null): array
    {
        return array(
            'MENUID' => $id,
            'LABEL' => $menu['label'] ?? Str::caseTitle($id),
            'PTH' => $menu['path'] ?? '#',
            'GRP' => $menu['group'] ?? null,
            'POS' => $menu['pos'] ?? null,
            'ICON' => $menu['icon'] ?? null,
            'ROLES' => $menu['roles'] ?? null,
            'ACTIVE' => 1,
            'PAYLOAD' => isset($menu['data']) ? json_encode($menu['data']) : null,
            'PARENT' => $parent['MENUID'] ?? null,
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
