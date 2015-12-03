<?php
/*
Plugin Name: PadSquad
Plugin URI: http://padsquad.com/
Description: PadSquad's mobile template solution
Author: John Chen
Version: 1.2.5
Author URI: http://padsquad.com/
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html
*/

if (!defined('PLUGIN_ROOT')) {
	define('PLUGIN_ROOT', ABSPATH . 'wp-content/plugins/padsquad/');	
}

include plugin_dir_path(__FILE__).'wordpress-core-plugin/padsquad.php';

// Check to see if extras file exists
if (file_exists(plugin_dir_path(__FILE__)."ps_extras.php")) {
	include "ps_extras.php";
}