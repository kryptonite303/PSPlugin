<?php
add_action("ps_extras", "show_simpli_iframe");
function show_simpli_iframe() {
	echo '<iframe name="simpli" style="height: 700px; width: 100%" src="http://simpli.padsquad.com" frameborder="0" scrolling="no" id="iframe"/>'; 
}

add_action("ps_beta_fields", "show_beta_fields");
function show_beta_fields() {
	add_settings_field("ps_beta_toggle", "Beta", "beta_radio", "psplugin_advanced", "section_advanced");
	register_setting("section_advanced", "ps_command_line_beta");
	register_setting("section_advanced", "ps_beta_toggle");
}


require 'plugin-updates/plugin-update-checker.php';
if (get_option("ps_beta_toggle") == "on") {
	update_option("ps_update_url", 'http://asset.padsquad.com/wpplugin/update_beta.json');
	$MyUpdateChecker = PucFactory::buildUpdateChecker (
			get_option("ps_update_url"),
			plugin_dir_path(__FILE__)."padsquad.php",
			'padsquad'
	);
} else {
	update_option("ps_update_url", 'http://asset.padsquad.com/wpplugin/update.json');
	$MyUpdateChecker = PucFactory::buildUpdateChecker (
			get_option("ps_update_url"),
			plugin_dir_path(__FILE__)."padsquad.php",
			'padsquad'
	);
}
?>