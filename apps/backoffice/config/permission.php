<?php

return [

    'models' => [

        /*
         * When using the "HasPermissions" trait from this package, we need to know which
         * Eloquent model should be used to retrieve your permissions. Of course, it
         * is often just the "Permission" model but you may use whatever you like.
         *
         * The model you want to use as a Permission model needs to implement the
         * `Spatie\Permission\Contracts\Permission` contract.
         */

        'permission' => Spatie\Permission\Models\Permission::class,

        /*
         * When using the "HasRoles" trait from this package, we need to know which
         * Eloquent model should be used to retrieve your roles. Of course, it
         * is often just the "Role" model but you may use whatever you like.
         *
         * The model you want to use as a Role model needs to implement the
         * `Spatie\Permission\Contracts\Role` contract.
         */

        'role' => Spatie\Permission\Models\Role::class,

    ],

    'table_names' => [

        /*
         * When using the "HasRoles" trait from this package, we need to know which
         * table should be used to retrieve your roles. We have chosen a basic
         * default value but you may easily change it to any table you like.
         */

        'roles' => 'roles',

        /*
         * When using the "HasPermissions" trait from this package, we need to know which
         * table should be used to retrieve your permissions. We have chosen a basic
         * default value but you may easily change it to any table you like.
         */

        'permissions' => 'permissions',

        /*
         * When using the "HasPermissions" trait from this package, we need to know which
         * table should be used to retrieve your models permissions. We have chosen a
         * basic default value but you may easily change it to any table you like.
         */

        'model_has_permissions' => 'model_has_permissions',

        /*
         * When using the "HasRoles" trait from this package, we need to know which
         * table should be used to retrieve your models roles. We have chosen a
         * basic default value but you may easily change it to any table you like.
         */

        'model_has_roles' => 'model_has_roles',

        /*
         * When using the "HasRoles" trait from this package, we need to know which
         * table should be used to retrieve your roles permissions. We have chosen a
         * basic default value but you may easily change it to any table you like.
         */

        'role_has_permissions' => 'role_has_permissions',
    ],

    'column_names' => [
        /*
         * Change this if you want to name the related pivots other than defaults
         */
        'role_pivot_key' => null, //default 'role_id',
        'permission_pivot_key' => null, //default 'permission_id',

        /*
         * Change this if you want to name the related model primary key other than
         * `model_id`.
         *
         * For example, this would be nice if your primary keys are all UUIDs. In
         * that case, name this `model_uuid`.
         */

        'model_morph_key' => 'model_id',

        /*
         * Change this if you want to use the teams feature and your related model's
         * foreign key is other than `team_id`.
         */

        'team_foreign_key' => 'team_id',
    ],

    /*
     * When set to true, the method for checking permissions will be registered on the gate.
     * Set this to false if you want to implement custom logic for checking permissions.
     */

    'register_permission_check_method' => true,

    /*
     * When set to true, Laravel\Octane\Events\OperationTerminated event listener will be registered
     * this will refresh permissions on every TickTerminated, TaskTerminated and RequestTerminated
     * NOTE: This should not be needed in most cases, but an Octane/Vapor combination benefited from it.
     */
    'register_octane_reset_listener' => false,

    /*
     * Teams Feature.
     * When set to true the package implements teams using the 'team_foreign_key'.
     * If you want the migrations to register the 'team_foreign_key', you must
     * set this to true before doing the migration.
     * If you already did the migration then you must make a new migration to also
     * add 'team_foreign_key' to 'roles', 'model_has_roles', and 'model_has_permissions'
     * (view the latest version of this package's migration file)
     */

    'teams' => false,

    /*
     * Passport Client Credentials Grant
     * When set to true the package will use Passports Client to check permissions
     */

    'use_passport_client_credentials' => false,

    /*
     * When set to true, the required permission names are added to exception messages.
     * This could be considered an information leak in some contexts, so the default
     * setting is false here for optimum safety.
     */

    'display_permission_in_exception' => false,

    /*
     * When set to true, the required role names are added to exception messages.
     * This could be considered an information leak in some contexts, so the default
     * setting is false here for optimum safety.
     */

    'display_role_in_exception' => false,

    /*
     * By default wildcard permission lookups are disabled.
     * See documentation to understand supported syntax.
     */

    'enable_wildcard_permission' => false,

    /*
     * The class to use for interpreting wildcard permissions.
     * If you need to modify delimiters, override the class and specify its name here.
     */
    // 'permission.wildcard_permission' => Spatie\Permission\WildcardPermission::class,

    /* Cache-specific settings */

    'cache' => [

        /*
         * By default all permissions are cached for 24 hours to speed up performance.
         * When permissions or roles are updated the cache is flushed automatically.
         */

        'expiration_time' => \DateInterval::createFromDateString('24 hours'),

        /*
         * The cache key used to store all permissions.
         */

        'key' => 'spatie.permission.cache',

        /*
         * You may optionally indicate a specific cache driver to use for permission and
         * role caching using any of the `store` drivers listed in the cache.php config
         * file. Using 'default' here means to use the `default` set in cache.php.
         */

        'store' => 'default',
    ],

    'journal_extra_info' => [
        'A-Username',
        'A-Password',
        'G-Username',
        'G-Password',
        'A1-Username',
        'A1-PAssword',
        'A2-Username',
        'A2-PAssword',
    ],
    'role_permissions' => [
        'all' => [
            'view own deals',
            'view all deals',
            'view team deals',
            'edit own deals',
            'edit all deals',
            'edit team deals',
            'delete own deals',
            'delete any deals',
            'delete team deals',
            'bulk delete deals',
            'export deals',

            'view deal client',
            'update own client',
            'update all client',
            'attach own client',
            'attach all client',
            'view deal product',
            'attach deal product',
            'view deal payment',
            'attach deal payment',
            'update deal payment status',
            'view deal associates',
            'attach deal associates',
            'attach deal associates',
            'change deal owner',
            'reopen deal',

            'view own journals',
            'view deal journals',
            'view all journals',
            'edit own journals',
            'edit deal journals',
            'edit all journals',
            'delete own journals',
            'delete any journals',
            'delete deal journals',


            'view own activities',
            'view all activities',
            'view deal activities',
            'edit own activities',
            'edit all activities',
            'edit deal activities',
            'delete own activities',
            'delete any activities',
            'delete deal activities',
            'bulk delete activities',
            'export activities',

            'view publication sheet',
            'update publication sheet',

            'view payments',
            'update payment status',
            'view products',
            'edit products',

            'deal status report',
            'deal stage report',

            'update settings',
            'update deal settings',
            'update user settings',
            'update role settings',
            'update team settings',
            'update bank settings',
        ],
        'initial' => [
            'view own activities',
            'edit own activities',
            'delete own activities',
        ],
        'grouped' => [
            [
                'as' => 'Deals',
                'views' => [
                    [
                        'as' => 'View',
                        'keys' => [
                            'view own deals',
                            'view all deals',
                            'view team deals',
                        ],
                        'permissions' => [
                            [
                                'value' => false,
                                'label' => 'Revoked'
                            ],
                            [
                                'value' => 'view own deals',
                                'label' => 'Owned Only'
                            ],
                            [
                                'value' => 'view all deals',
                                'label' => 'All Deals'
                            ],
                            [
                                'value' => 'view team deals',
                                'label' => 'Team Only'
                            ]
                        ],
                        'single' => false,
                        'revokeable' => false
                    ],
                    [
                        'as' => 'Edit',
                        'keys' => [
                            'edit own deals',
                            'edit all deals',
                            'edit team deals',
                        ],
                        'permissions' => [
                            [
                                'value' => false,
                                'label' => 'Revoked'
                            ],
                            [
                                'value' => 'edit own deals',
                                'label' => 'Owned Only'
                            ],
                            [
                                'value' => 'edit all deals',
                                'label' => 'All Deals'
                            ],
                            [
                                'value' => 'edit team deals',
                                'label' => 'Team Only'
                            ]
                        ],
                        'single' => false,
                        'revokeable' => false
                    ],
                    [
                        'as' => 'Delete',
                        'keys' => [
                            'delete own deals',
                            'delete any deals',
                            'delete team deals',
                        ],
                        'permissions' => [
                            [
                                'value' => false,
                                'label' => 'Revoked'
                            ],
                            [
                                'value' => 'delete own deals',
                                'label' => 'Owned Only'
                            ],
                            [
                                'value' => 'delete any deals',
                                'label' => 'All Deals'
                            ],
                            [
                                'value' => 'delete team deals',
                                'label' => 'Team Only'
                            ]
                        ],
                        'single' => false,
                        'revokeable' => true
                    ],
                    [
                        'as' => 'Bulk Delete',
                        'keys' => [
                            'bulk delete deals'
                        ],
                        'permissions' => [
                            [
                                'value' => false,
                                'label' => 'Revoked'
                            ],
                            [
                                'value' => 'bulk delete deals',
                                'label' => 'Granted'
                            ]
                        ],
                        'single' => true,
                        'revokeable' => true
                    ],
                    [
                        'as' => 'Export',
                        'keys' => [
                            'export deals'
                        ],
                        'permissions' => [
                            [
                                'value' => false,
                                'label' => 'Revoked'
                            ],
                            [
                                'value' => 'export deals',
                                'label' => 'Granted'
                            ]
                        ],
                        'single' => true,
                        'revokeable' => true
                    ],









                    [
                        'as' => 'View Deal Client',
                        'keys' => [
                            'view deal client'
                        ],
                        'permissions' => [
                            [
                                'value' => false,
                                'label' => 'Revoked'
                            ],
                            [
                                'value' => 'view deal client',
                                'label' => 'Granted'
                            ]
                        ],
                        'single' => true,
                        'revokeable' => true
                    ],
                    [
                        'as' => 'Update Deal Client',
                        'keys' => [
                            'update own client',
                            'update all client'
                        ],
                        'permissions' => [
                            [
                                'value' => false,
                                'label' => 'Revoked'
                            ],
                            [
                                'value' => 'update own client',
                                'label' => 'Owned Only'
                            ],
                            [
                                'value' => 'update all client',
                                'label' => 'All Clients'
                            ]
                        ],
                        'single' => true,
                        'revokeable' => true
                    ],
                    [
                        'as' => 'Attach Deal Client',
                        'keys' => [
                            'attach own client',
                            'attach all client'
                        ],
                        'permissions' => [
                            [
                                'value' => false,
                                'label' => 'Revoked'
                            ],
                            [
                                'value' => 'attach own client',
                                'label' => 'Owned Only'
                            ],
                            [
                                'value' => 'attach all client',
                                'label' => 'All Clients'
                            ]
                        ],
                        'single' => true,
                        'revokeable' => true
                    ],
                    [
                        'as' => 'View Deal Services',
                        'keys' => [
                            'view deal product'
                        ],
                        'permissions' => [
                            [
                                'value' => false,
                                'label' => 'Revoked'
                            ],
                            [
                                'value' => 'view deal product',
                                'label' => 'Granted'
                            ]
                        ],
                        'single' => true,
                        'revokeable' => true
                    ],
                    [
                        'as' => 'Add / Update Deal Services',
                        'keys' => [
                            'attach deal product'
                        ],
                        'permissions' => [
                            [
                                'value' => false,
                                'label' => 'Revoked'
                            ],
                            [
                                'value' => 'attach deal product',
                                'label' => 'Granted'
                            ]
                        ],
                        'single' => true,
                        'revokeable' => true
                    ],
                    [
                        'as' => 'View Deal Payments',
                        'keys' => [
                            'view deal payment'
                        ],
                        'permissions' => [
                            [
                                'value' => false,
                                'label' => 'Revoked'
                            ],
                            [
                                'value' => 'view deal payment',
                                'label' => 'Granted'
                            ]
                        ],
                        'single' => true,
                        'revokeable' => true
                    ],
                    [
                        'as' => 'Add / Attach Deal Payment',
                        'keys' => [
                            'attach deal payment'
                        ],
                        'permissions' => [
                            [
                                'value' => false,
                                'label' => 'Revoked'
                            ],
                            [
                                'value' => 'attach deal payment',
                                'label' => 'Granted'
                            ]
                        ],
                        'single' => true,
                        'revokeable' => true
                    ],
                    [
                        'as' => 'Update Payment Status',
                        'keys' => [
                            'update Deal Payment status'
                        ],
                        'permissions' => [
                            [
                                'value' => false,
                                'label' => 'Revoked'
                            ],
                            [
                                'value' => 'update deal payment status',
                                'label' => 'Granted'
                            ]
                        ],
                        'single' => true,
                        'revokeable' => true
                    ],
                    [
                        'as' => 'View Deal Associate Departments',
                        'keys' => [
                            'view deal associates'
                        ],
                        'permissions' => [
                            [
                                'value' => false,
                                'label' => 'Revoked'
                            ],
                            [
                                'value' => 'view deal associates',
                                'label' => 'Granted'
                            ]
                        ],
                        'single' => true,
                        'revokeable' => true
                    ],
                    [
                        'as' => 'Copy Deal to Departments',
                        'keys' => [
                            'attach deal associates'
                        ],
                        'permissions' => [
                            [
                                'value' => false,
                                'label' => 'Revoked'
                            ],
                            [
                                'value' => 'attach deal associates',
                                'label' => 'Granted'
                            ]
                        ],
                        'single' => true,
                        'revokeable' => true
                    ],
                    [
                        'as' => 'Change Deal Owner',
                        'keys' => [
                            'change deal owner'
                        ],
                        'permissions' => [
                            [
                                'value' => false,
                                'label' => 'Revoked'
                            ],
                            [
                                'value' => 'change deal owner',
                                'label' => 'Granted'
                            ]
                        ],
                        'single' => true,
                        'revokeable' => true
                    ],
                    [
                        'as' => 'Reopen Won / Closed Deal',
                        'keys' => [
                            'reopen deal'
                        ],
                        'permissions' => [
                            [
                                'value' => false,
                                'label' => 'Revoked'
                            ],
                            [
                                'value' => 'reopen deal',
                                'label' => 'Granted'
                            ]
                        ],
                        'single' => true,
                        'revokeable' => true
                    ],
                ]
            ],
            [
                'as' => 'Journal',
                'views' => [
                    [
                        'as' => 'View',
                        'keys' => [
                            'view own journals',
                            'view deal journals',
                            'view all journals',
                        ],
                        'permissions' => [
                            [
                                'value' => false,
                                'label' => 'Revoked'
                            ],
                            [
                                'value' => 'view own journals',
                                'label' => 'Owned Only'
                            ],
                            [
                                'value' => 'view all journals',
                                'label' => 'All Journals'
                            ],
                            [
                                'value' => 'view deal journals',
                                'label' => 'View Deal Journals'
                            ]
                        ],
                        'single' => false,
                        'revokeable' => false
                    ],
                    [
                        'as' => 'Edit',
                        'keys' => [
                            'edit own journals',
                            'edit deal journals',
                            'edit all journals',
                        ],
                        'permissions' => [
                            [
                                'value' => false,
                                'label' => 'Revoked'
                            ],
                            [
                                'value' => 'edit own journals',
                                'label' => 'Owned Only'
                            ],
                            [
                                'value' => 'edit all journals',
                                'label' => 'All Journals'
                            ],
                            [
                                'value' => 'edit deal journals',
                                'label' => 'My Deal Journals'
                            ]
                        ],
                        'single' => false,
                        'revokeable' => false
                    ],
                    [
                        'as' => 'Delete',
                        'keys' => [
                            'delete own journals',
                            'delete any journals',
                            'delete deal journals',
                        ],
                        'permissions' => [
                            [
                                'value' => false,
                                'label' => 'Revoked'
                            ],
                            [
                                'value' => 'delete own journals',
                                'label' => 'Owned Only'
                            ],
                            [
                                'value' => 'delete any journals',
                                'label' => 'All Journals'
                            ],
                            [
                                'value' => 'delete deal journals',
                                'label' => 'My Deal Journals'
                            ]
                        ],
                        'single' => false,
                        'revokeable' => true
                    ]
                ]
            ],
            [
                'as' => 'Activities',
                'views' => [
                    [
                        'as' => 'View',
                        'keys' => [
                            'view own activities',
                            'view all activities',
                            'view deal activities',
                        ],
                        'permissions' => [
                            [
                                'value' => false,
                                'label' => 'Revoked'
                            ],
                            [
                                'value' => 'view own activities',
                                'label' => 'Owned Only'
                            ],
                            [
                                'value' => 'view all activities',
                                'label' => 'All Activities'
                            ],
                            [
                                'value' => 'view deal activities',
                                'label' => 'My Deal Activities'
                            ]
                        ],
                        'single' => false,
                        'revokeable' => false
                    ],
                    [
                        'as' => 'Edit',
                        'keys' => [
                            'edit own activities',
                            'edit all activities',
                            'edit deal activities',
                        ],
                        'permissions' => [
                            [
                                'value' => false,
                                'label' => 'Revoked'
                            ],
                            [
                                'value' => 'edit own activities',
                                'label' => 'Owned Only'
                            ],
                            [
                                'value' => 'edit all activities',
                                'label' => 'All Activities'
                            ],
                            [
                                'value' => 'edit deal activities',
                                'label' => 'My Deal Activities'
                            ]
                        ],
                        'single' => false,
                        'revokeable' => false
                    ],
                    [
                        'as' => 'Delete',
                        'keys' => [
                            'delete own activities',
                            'delete any activities',
                            'delete deal activities',
                        ],
                        'permissions' => [
                            [
                                'value' => false,
                                'label' => 'Revoked'
                            ],
                            [
                                'value' => 'delete own activities',
                                'label' => 'Owned Only'
                            ],
                            [
                                'value' => 'delete any activities',
                                'label' => 'All Activities'
                            ],
                            [
                                'value' => 'delete deal activities',
                                'label' => 'My Deal Activities'
                            ]
                        ],
                        'single' => false,
                        'revokeable' => true
                    ],
                    [
                        'as' => 'Bulk Delete',
                        'keys' => [
                            'bulk delete activities'
                        ],
                        'permissions' => [
                            [
                                'value' => false,
                                'label' => 'Revoked'
                            ],
                            [
                                'value' => 'bulk delete activities',
                                'label' => 'Granted'
                            ]
                        ],
                        'single' => true,
                        'revokeable' => true
                    ],
                    [
                        'as' => 'Export',
                        'keys' => [
                            'export activities'
                        ],
                        'permissions' => [
                            [
                                'value' => false,
                                'label' => 'Revoked'
                            ],
                            [
                                'value' => 'export activities',
                                'label' => 'Granted'
                            ]
                        ],
                        'single' => true,
                        'revokeable' => true
                    ]
                ]
            ],
            [
                'as' => 'Publication Sheet',
                'views' => [
                    [
                        'as' => 'View Publication Sheet',
                        'keys' => [
                            'view publication sheet'
                        ],
                        'permissions' => [
                            [
                                'value' => false,
                                'label' => 'Revoked'
                            ],
                            [
                                'value' => 'view publication sheet',
                                'label' => 'Granted'
                            ]
                        ]
                    ],
                    [
                        'as' => 'Update Publication Sheet',
                        'keys' => [
                            'update publication sheet'
                        ],
                        'permissions' => [
                            [
                                'value' => false,
                                'label' => 'Revoked'
                            ],
                            [
                                'value' => 'update publication sheet',
                                'label' => 'Granted'
                            ]
                        ]
                    ],
                ]
            ],
            [
                'as' => 'Payments',
                'views' => [
                    [
                        'as' => 'View / Update Payments',
                        'keys' => [
                            'view payments'
                        ],
                        'permissions' => [
                            [
                                'value' => false,
                                'label' => 'Revoked'
                            ],
                            [
                                'value' => 'view payments',
                                'label' => 'View All Payments'
                            ],
                            [
                                'value' => 'view own payments',
                                'label' => 'View Own Deal Payments'
                            ]
                        ]
                    ],
                    [
                        'as' => 'Update Payment Status',
                        'keys' => [
                            'update payment status'
                        ],
                        'permissions' => [
                            [
                                'value' => false,
                                'label' => 'Revoked'
                            ],
                            [
                                'value' => 'update payment status',
                                'label' => 'Granted'
                            ]
                        ]
                    ]
                ]
            ],
            [
                'as' => 'Services',
                'views' => [
                    [
                        'as' => 'View Services',
                        'keys' => [
                            'view products'
                        ],
                        'permissions' => [
                            [
                                'value' => false,
                                'label' => 'Revoked'
                            ],
                            [
                                'value' => 'view products',
                                'label' => 'Granted'
                            ]
                        ]
                    ],
                    [
                        'as' => 'Update Services',
                        'keys' => [
                            'edit products'
                        ],
                        'permissions' => [
                            [
                                'value' => false,
                                'label' => 'Revoked'
                            ],
                            [
                                'value' => 'edit products',
                                'label' => 'Granted'
                            ]
                        ]
                    ]
                ]
            ],
            [
                'as' => 'Settings',
                'views' => [
                    [
                        'as' => 'Update Settings',
                        'keys' => [
                            'update settings'
                        ],
                        'permissions' => [
                            [
                                'value' => false,
                                'label' => 'Revoked'
                            ],
                            [
                                'value' => 'update settings',
                                'label' => 'Granted'
                            ]
                        ]
                    ],
                    [
                        'as' => 'Update Deal Settings',
                        'keys' => [
                            'update deal settings'
                        ],
                        'permissions' => [
                            [
                                'value' => false,
                                'label' => 'Revoked'
                            ],
                            [
                                'value' => 'update deal settings',
                                'label' => 'Granted'
                            ]
                        ]
                    ],
                    [
                        'as' => 'Update User Settings',
                        'keys' => [
                            'update user settings'
                        ],
                        'permissions' => [
                            [
                                'value' => false,
                                'label' => 'Revoked'
                            ],
                            [
                                'value' => 'update user settings',
                                'label' => 'Granted'
                            ]
                        ]
                    ],
                    [
                        'as' => 'Update Role Settings',
                        'keys' => [
                            'update role settings'
                        ],
                        'permissions' => [
                            [
                                'value' => false,
                                'label' => 'Revoked'
                            ],
                            [
                                'value' => 'update role settings',
                                'label' => 'Granted'
                            ]
                        ]
                    ],
                    [
                        'as' => 'Update Team Settings',
                        'keys' => [
                            'update team settings'
                        ],
                        'permissions' => [
                            [
                                'value' => false,
                                'label' => 'Revoked'
                            ],
                            [
                                'value' => 'update team settings',
                                'label' => 'Granted'
                            ]
                        ]
                    ],
                    [
                        'as' => 'Update Bank Settings',
                        'keys' => [
                            'update bank settings'
                        ],
                        'permissions' => [
                            [
                                'value' => false,
                                'label' => 'Revoked'
                            ],
                            [
                                'value' => 'update bank settings',
                                'label' => 'Granted'
                            ]
                        ]
                    ]
                ]
            ],
            [
                'as' => 'Reports',
                'views' => [
                    [
                        'as' => 'Deal Status Report',
                        'keys' => [
                            'deal status report'
                        ],
                        'permissions' => [
                            [
                                'value' => false,
                                'label' => 'Revoked'
                            ],
                            [
                                'value' => 'deal status report',
                                'label' => 'Granted'
                            ]
                        ]
                    ],
                    [
                        'as' => 'Deal Stage Report',
                        'keys' => [
                            'deal stage report'
                        ],
                        'permissions' => [
                            [
                                'value' => false,
                                'label' => 'Revoked'
                            ],
                            [
                                'value' => 'deal stage report',
                                'label' => 'Granted'
                            ]
                        ]
                    ]
                ]
            ]
        ]
    ]
];
