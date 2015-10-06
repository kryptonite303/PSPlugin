<?php
/*
Plugin Name: PadSquad
Plugin URI: http://padsquad.com/
Description: PadSquad's mobile template solution
Author: John Chen
Version: 1.0.11
Author URI: http://padsquad.com/
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html
*/

include plugin_dir_path(__FILE__).'wordpress-core-plugin/padsquad.php';

// Check to see if extras file exists
if (file_exists(plugin_dir_path(__FILE__)."ps_extras.php")) {
	include "ps_extras.php";
}