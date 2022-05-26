<ul {{ $attributes->class(array('navbar-nav mb-2 mb-lg-0', 'ms-auto' => $end)) }}>
  @foreach ($_menu() as $row)
    @if ($children = $_menu($row))
      <li class="nav-item dropdown">
        <a {{ $_groupAttr($row) }}>@if ($row->icon)<i class="bi-{{ $row->icon }} me-1"></i>@endif{{ $row->label }}</a>
        <ul class="dropdown-menu{{ $end ? ' dropdown-menu-end' : null }}" aria-labelledby="{{ $row->menuid }}">
          @foreach ($children as $child)
            @if ($child->separator)
              <li><hr class="dropdown-divider"></li>
            @else
              <li><a {{ $_itemAttr($child, true)}}>@if ($child->icon)<i class="bi-{{ $child->icon }} me-1"></i>@endif{{ $child->label }}</a></li>
            @endif
          @endforeach
        </ul>
      </li>
    @else
      <li class="nav-item">
        <a {{ $_itemAttr($row) }}>@if ($row->icon)<i class="bi-{{ $row->icon }} me-1"></i>@endif{{ $row->label }}</a>
      </li>
    @endif
  @endforeach
</ul>
