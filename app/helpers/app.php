<?php

/** Check if current environment is development */
function is_dev(): bool {
    return in_array(env('APP_ENV', 'production'), array('local', 'dev', 'development'));
}

/** Return $class if $route match current request route */
function clsa(string $route, string $class = null): string|null {
    return request()->routeIs($route) ? ($class ?? 'active') : null;
}

/** Return $class if $path match current request path  */
function clsu(string $path, string $class = null): string|null {
    return request()->is($path) ? ($class ?? 'active') : null;
}

/** Collect renamed and ignored $source data */
function cdata(array $source, array $renames = null, array $ignores = null): array {
    $data = array_diff_key($source, array_flip($ignores ?? array()));

    array_walk($renames, static function (string $key, string $rename) use (&$data) {
        $data[$rename] = $data[$key];

        unset($data[$key]);
    });

    return $data;
}

/** Get $class name without namespace prefixed */
function cname(string $class): string {
    return ltrim(strrchr('\\' . $class, '\\'), '\\');
}

/** Get $class constansts filtered by optional $prefix */
function cconst(string|object $class, string $prefix = null): array {
    $const = (new ReflectionClass($class))->getConstants();

    return $prefix ? array_filter(
        $const,
        static fn (string $name) => str_starts_with($name, $prefix),
        ARRAY_FILTER_USE_KEY,
    ) : $const;
}
