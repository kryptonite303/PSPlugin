<?php
add_action("ps_extras", "show_simpli_iframe");
function show_simpli_iframe() {
	echo '<iframe name="simpli" style="height: 700px; width: 100%" src="http://simpli.padsquad.com" frameborder="0" scrolling="no" id="iframe"/>'; 
}

require 'plugin-updates/plugin-update-checker.php';
$MyUpdateChecker = PucFactory::buildUpdateChecker (
		'http://asset.padsquad.com/plugin/update.json',
		plugin_dir_path(__FILE__)."padsquad.php",
		'padsquad'
);
?>