<?php

return [
    'timeline' => [
        'created' => 'The record has been created by <b>:causer_name</b>.',
        'updated' => 'The record has been updated by <b>:causer_name</b>.',
        'stage_changed' => '<b>:causer_name</b> moved the deal from <b>:previous</b> to <b>:stage</b>.',
        'product' => 'Services have been updated with a total amount of <b>Rs :total</b> by <b>:causer_name</b>.',
        'journal' => 'The Journal <b>:name</b> has been added to the record by <b>:causer_name</b>.',
        'journal_status' => '<b>:causer_name</b> has changed the Journal <b>:name</b> status to <b>:status</b>.',
        'payment' => '<b>:causer_name</b> has added a payment receipt of <b>Rs :paid_amount</b>.',
        'payment_status' => '<b>:causer_name</b> has changed the payment status to <b>:status_label</b> for the amount of <b>Rs :paid_amount</b>.',
        'contact_attach' => '<b>:causer_name</b> has added the client <b>:name</b> to the record.',
        'contact_detach' => '<b>:causer_name</b> has removed the client <b>:name</b> from the record.',
        'status_change' => '<b>:causer_name</b> has changed the status to <b>:status</b>.',
        'owner_change' => '<b>:causer_name</b> has changed the record owner to <b>:name</b>.',
        'deal_clone' => '<b>:causer_name</b> has cloned this deal into <b>:name</b> pipeline.',
    ],
    'filters' => [
        'my' => 'My Deals'
    ]
];