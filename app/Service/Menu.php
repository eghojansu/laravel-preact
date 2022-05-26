<?php

namespace App\Service;

use App\Models\User;
use App\Models\Csmenu;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;

class Menu
{
    public function getMenu(string $group, Csmenu $parent = null): Collection
    {
        return Csmenu::where(function (Builder $builder) use ($group, $parent) {
            if ($parent) {
                $builder->where('parent', $parent->menuid);
            } else {
                $builder->whereNull('parent');
            }

            $builder->where('grp', $group);
        })->orderBy('grade')->get();
    }

    public function getTree(string ...$groups): array
    {
        /** @var User $user */
        $user = auth()->user();
        $rows = Csmenu::whereIn('grp', $groups)->get();
        $pick = array(
            'menuid',
            'label',
            'icon',
            'url',
            'parent',
            'grp',
            'attrs',
        );

        /** @var array */
        $menu = $rows->filter(
            static fn (Csmenu $row) => !$row->parent && (
                !$row->perm || $user->allowed($row->perm)
            ),
        )->sortBy('grade')->reduce(
            static function (array $menu, Csmenu $row) use ($user, $rows, $pick) {
                $children = $rows->filter(
                    static fn (Csmenu $child) => (
                        $child->grp === $row->grp
                        && $child->parent === $row->menuid
                        && (
                            !$child->perm
                            || $user->allowed($child->perm)
                        )
                    ),
                );

                if (($row->url && '#' !== $row->url) || $children->isNotEmpty()) {
                    $add = $row->only($pick);
                    $add['items'] = $children->sortBy('grade')->map(
                        static fn (Csmenu $row) => $row->only($pick),
                    )->values()->toArray();

                    $menu[$row->grp][] = $add;
                }

                return $menu;
            },
            array(),
        );

        return $menu;
    }
}
