<?php

return array(
    'dsb' => array(
        'label' => 'Dashboard',
        'path' => '/admin',
        'icon' => 'house-door',
    ),
    'acc' => array(
        'label' => 'Account',
        'icon' => 'person-circle',
        'items' => array(
            'acc1' => array(
                'label' => 'Profile',
                'icon' => 'person',
                'path' => '/admin/profile',
            ),
            'acc2' => array(
                'label' => 'Pengumuman',
                'icon' => 'megaphone',
                'path' => '/admin/profile/news',
            ),
            'acc3' => array(
                'label' => 'Logout',
                'icon' => 'power',
                'data' => array(
                    'logout' => true,
                ),
            ),
        ),
    ),
);
