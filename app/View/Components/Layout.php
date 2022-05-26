<?php

namespace App\View\Components;

use Illuminate\Foundation\Inspiring;
use Illuminate\View\Component;

class Layout extends Component
{
    /**
     * Create a new component instance.
     *
     * @return void
     */
    public function __construct(
        public string|null $pageTitle = null,
        public string|null $title = null,
        public string|null $defaultTitle = 'Home',
    ) {}

    public function _pageTitle(): string
    {
        return $this->pageTitle ?? (($this->title ?? $this->defaultTitle) . ' - ' . config('app.name'));
    }

    /**
     * Get the view / contents that represent the component.
     *
     * @return \Illuminate\Contracts\View\View|\Closure|string
     */
    public function render()
    {
        return view('components.layout');
    }
}
