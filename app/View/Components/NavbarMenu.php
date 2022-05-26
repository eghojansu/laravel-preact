<?php

namespace App\View\Components;

use App\Models\Csmenu;
use App\Service\Menu;
use Illuminate\View\Component;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Route;
use Illuminate\View\ComponentAttributeBag;

class NavbarMenu extends Component
{
    /**
     * Create a new component instance.
     *
     * @return void
     */
    public function __construct(
        public string|null $group = null,
        public bool|null $end = null,
        private Menu $menu,
    ) {}

    private function attrs(array|null $attrs): array
    {
        $norms = $attrs ?? array();
        $class = $attrs['class'] ?? null;

        unset($norms['class']);

        return array($norms, $class);
    }

    public function _itemAttr(Csmenu $menu, bool $dropdown = null): ComponentAttributeBag
    {
        $active = ($menu->route && clsa($menu->route)) || ($menu->url && clsu($menu->url));
        list($attrs, $class) = $this->attrs($menu->attrs);

        return (new ComponentAttributeBag())->class(array(
            $dropdown ? 'dropdown-item' : 'nav-link',
            'active' => $active,
            $class,
        ))->merge($attrs + array(
            'aria-current' => $active ? 'page' : null,
            'href' => $menu->route && Route::has($menu->route)  ? route($menu->route, $menu->args ?? array(), false) : (
                $menu->url ? url($menu->url) : '#' . ($menu->route)
            ),
        ));
    }

    public function _groupAttr(Csmenu $menu): ComponentAttributeBag
    {
        list($attrs, $class) = $this->attrs($menu->attrs);

        return (new ComponentAttributeBag())->class(array(
            'nav-link',
            'dropdown-toggle',
            $class,
        ))->merge($attrs + array(
            'href' => '#',
            'role' => 'button',
            'data-bs-toggle' => 'dropdown',
            'aria-expanded' => 'false',
            'id' => $menu->menuid,
        ));
    }

    public function _menu(Csmenu $parent = null): Collection|null
    {
        $menu = $this->menu->getMenu($this->group, $parent);

        return $menu->isEmpty() ? null : $menu;
    }

    /**
     * Get the view / contents that represent the component.
     *
     * @return \Illuminate\Contracts\View\View|\Closure|string
     */
    public function render()
    {
        return view('components.navbar-menu');
    }
}
