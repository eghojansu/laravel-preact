<?php

namespace App\View\Components;

use Illuminate\View\Component;

class Dashboard extends Component
{
    /**
     * Create a new component instance.
     *
     * @return void
     */
    public function __construct(
        public string|null $pageTitle = null,
        public string|null $title = null,
        public string|null $defaultTitle = 'Dashboard',
    ) {}

    /**
     * Get the view / contents that represent the component.
     *
     * @return \Illuminate\Contracts\View\View|\Closure|string
     */
    public function render()
    {
        return view('components.dashboard');
    }
}
