#pragma strict
import System.Collections.Generic;
import System.IO;

var tc_script_id: int;
var tc_installed: boolean = false;
var check_image: Texture2D;

var layer_count: boolean = true;
var placed_count: boolean = true;
var display_project: boolean = true;
var tabs: boolean = true;

var color_scheme: boolean = true;
var color_layout: color_settings_class = new color_settings_class();
var color_layout_converted: boolean = false; 
var box_scheme: boolean = false;
var display_color_curves: boolean = false;
var display_mix_curves: boolean = true;
var filter_select_text: boolean = true;

var install_path: String;
var install_path_full: String;

var object_fast: boolean = true;
var preview_texture: boolean = true;
var preview_texture_buffer: int = 100;
var preview_colors: boolean = true;
var preview_texture_resolution: int = 128; 
var preview_texture_resolution1: int = 128;
var preview_quick_resolution_min: int = 16;
var preview_splat_brightness: float = 1;
var preview_texture_dock: boolean = true;

var preview_target_frame: int = 30;
var splat_colors: List.<Color> = new List.<Color>();
var splat_custom_texture_resolution: int = 128; 
var splat_custom_texture_resolution1: int = 128;
var tree_colors: List.<Color> = new List.<Color>();
var grass_colors: List.<Color> = new List.<Color>();
var object_colors: List.<Color> = new List.<Color>();

var toggle_text_no: boolean = false;
var toggle_text_short: boolean = true;
var toggle_text_long: boolean = false;
var tooltip_text_no: boolean = false;
var tooltip_text_short: boolean = false;
var tooltip_text_long: boolean = true;
var tooltip_mode: int = 2;

var video_help: boolean = true;

var run_in_background: boolean = true;
var display_bar_auto_generate: boolean = true;

var unload_textures: boolean = false;
var clean_memory: boolean = false;

var auto_speed: boolean = true;
var target_frame: int = 40;

var auto_save: boolean = true;
var auto_save_tc_instances: int = 2;
var auto_save_scene_instances: int = 2;
var auto_save_tc: boolean = true; 
var auto_save_tc_list: List.<String> = new List.<String>(); 
var auto_save_scene: boolean = true;
var auto_save_scene_list: List.<String> = new List.<String>();
var auto_save_timer: float = 10;
var auto_save_time_start: float;
var auto_save_on_play: boolean = true;
var auto_save_path: String;

var terrain_tiles_max: int = 15;

var auto_search_list: List.<auto_search_class> = new List.<auto_search_class>();

var map: map_class = new map_class();

enum map_type_enum {Aerial,AerialWithLabels,Road}
enum condition_output_enum{add = 0,subtract = 1,change = 2,multiply = 3,devide = 4,difference = 5,average = 6,max = 7,min = 8}

var tex1: Texture2D;

var select_window: select_window_class = new select_window_class(); 

var preview_window: List.<int> = new List.<int>();
var PI: float = Mathf.PI;

var map0: Texture2D;
var map1: Texture2D;
var map2: Texture2D;
var map3: Texture2D;
var map4: Texture2D;
var map5: Texture2D;
var map_combine: boolean = false;
var map_load: boolean = false;
var map_load2: boolean = false;
var map_load3: boolean = false;
var map_load4: boolean = false;
var map_zoom1: int;
var map_zoom2: int;
var map_zoom3: int;
var map_zoom4: int;

var map_latlong: latlong_class = new latlong_class();

var map_latlong_center: latlong_class = new latlong_class();

var map_zoom: int = 17;
var map_zoom_old: int;

var settings: global_settings_class = new global_settings_class();

enum raw_mode_enum{Windows,Mac}
enum resolution_mode_enum{Automatic,Heightmap,Splatmap,Tree,Detailmap,Object,Units,Custom}

class edit_class
{
	var text: String = String.Empty;
	var default_text: String = String.Empty;
	var edit: boolean = false;
	var disable_edit: boolean = false;
	var rect: Rect;
}

class global_settings_class
{
	var myExt: WWW;
    var myExt2: WWW;
    var myExt3: WWW;
    var myExt4: WWW;
    
    var rtp: boolean = false;
    var video_help: boolean = true;
    var view_only_output: boolean = true;
    var save_global_timer: float = 5;
    
    var download: WWW;
    var downloading: int = 0;
    var download_foldout: boolean = true;
    var download_display: boolean = true;
    
    var wc_contents: WWW;
    var wc_loading: int;
    var old_version: float;
	var new_version: float;
	var update_display: boolean = false;
	var update_display2: boolean = false;
	var update_version: boolean = false;
	var update_version2: boolean = false;
	var update: String[] = ["Don't check","Notify","Download and notify","Download,import and notify","Download and import automatically"]; 
	var time_out: float;
	
    var button_export: boolean = true;
    var button_measure: boolean = true;
    var button_capture: boolean = true;
    var button_tools: boolean = true;
    var button_tiles: boolean = true;
    var button_node: boolean = true; 
    var button_world: boolean = true;
}

class terrain_region_class
{
	var active: boolean = true;
	var foldout: boolean = true;
	var text: String = "Terrain Area";
	var area: List.<terrain_area_class> = new List.<terrain_area_class>();
	var area_select: int = 0;
	var mode: int = 0;
	var area_size: Rect;
	
	
	// mode
	// 0 -> fitting tiles
	// 1 -> custom tiles
	
	function terrain_region_class()
	{
		area.Add(new terrain_area_class());
	}
	
	function add_area(index: int)
	{
		area.Insert(index,new terrain_area_class());
		set_area_index();
		set_area_text();
		area[index].set_terrain_text();
		area[index].path = Application.dataPath;
	}
	
	function erase_area(index: int)
	{
		area.RemoveAt(index);
		set_area_index();
		set_area_text();
	}
	
	function set_area_index()
	{
		for (var count_area: int = 0;count_area < area.Count;++count_area)
		{
			area[count_area].index = count_area;
		}
	}
	
	function set_area_text()
	{
		if (area.Count > 1){text = "Terrain Areas";} else {text = "Terrain Area";}
	}
} 

// terrain area class
class terrain_area_class
{
	var terrains: List.<terrain_class2> = new List.<terrain_class2>();
	var index: int;
	var tiles: tile_class = new tile_class();
	var tiles_select: tile_class = new tile_class(); 
	var tiles_total: int;
	var tiles_select_total: int;
	var tiles_assigned_total: int;
	var tiles_select_link: boolean = true;
	var size: Vector3;
	var center: Vector3 = new Vector3(0,0,0);
	var edit: boolean = false;
	var disable_edit: boolean = false;
	var area_foldout: boolean = false;
	var tiles_foldout: boolean = false;
	var settings_foldout: boolean = false;
	var center_synchronous: boolean = true; 
	var tile_synchronous: boolean = true;
	var tile_position_synchronous: boolean = true;
	var rect: Rect;
	var rect1: Rect;
	var text: String;
	var text_edit: String = String.Empty;
	var display_short: boolean;
	var remarks: remarks_class = new remarks_class();
	var copy_settings: boolean = true;
	var copy_terrain: int = 0;
	
	var foldout: boolean = true;
	var terrains_active: boolean = true;
	var terrains_scene_active: boolean = true;
	var terrains_foldout: boolean = true;
	
	var auto_search: auto_search_class = new auto_search_class();
	var auto_name: auto_search_class = new auto_search_class();
	
	var path: String;
	var parent: Transform;
	var scene_name: String = "Terrain";
	var asset_name: String = "New Terrain";
	
	var resize: boolean = false;
	
	var resize_left: boolean = false;
	var resize_right: boolean = false;
	var resize_top: boolean = false;
	var resize_bottom: boolean = false;
	var resize_topLeft: boolean = false;
	var resize_topRight: boolean = false;
	var resize_bottomLeft: boolean = false;
	var resize_bottomRight: boolean = false;
	var resize_center: boolean = false;
	
	function terrain_area_class()
	{
		set_terrain_text();
	}
	
	function clear()
	{
		terrains.Clear();
		set_terrain_text();
	}
	
	function clear_to_one()
	{
		var length: int = terrains.Count;
		for (var count_terrain: int = 1;count_terrain < length;++count_terrain)
		{
			terrains.RemoveAt(1);
		}
		set_terrain_text();
	}
	
	function set_terrain_text() 
	{
		if (text_edit.Length == 0)
		{
			if (terrains.Count > 1){text = "Terrains";} else {text = "Terrain";}
		}
		else {text = text_edit;}
		
		text += " ("+terrains.Count.ToString()+")";
	}
}

// terrain_class
class terrain_class2
{
	var active: boolean = true;
	var foldout: boolean = false;
	var index: int;
	var index_old: int;
	var on_row: boolean = false;
	var color_terrain: Color = Color(2,2,2,1);
	
	// var heights: float[,];
	
	var splat_alpha: Texture2D[];
	
	var terrain: Terrain;
	var parent: Transform;
	var name: String;
	var prearea: area_class = new area_class();
	var map: float[,,];
	var splatPrototypes: List.<splatPrototype_class> = new List.<splatPrototype_class>();
	var colormap: splatPrototype_class = new splatPrototype_class();
	var splats_foldout: boolean = false;
	var treePrototypes: List.<treePrototype_class> = new List.<treePrototype_class>();
	var trees_foldout: boolean = false;
	var detailPrototypes: List.<detailPrototype_class> = new List.<detailPrototype_class>();
	var details_foldout: boolean = false;
	var tree_instances: List.<TreeInstance> = new List.<TreeInstance>();
	var splat: float[];
	var splat_calc: float[];
	var color: float[];
	var splat_layer: float[];
	var color_layer: float[];
	var grass: float[];
	
	var heightmap_resolution_list: int = 5;
	var splatmap_resolution_list: int = 4;
	var basemap_resolution_list: int = 4;
	var detailmap_resolution_list: int;
	var detail_resolution_per_patch_list: int = 0;
	
	var size: Vector3 = Vector3(1000,250,1000);
	var size_xz_link: boolean = true;
	var tile_x: int;
	var tile_z: int;
	var tiles: Vector2 = Vector2(1,1);
	var rect: Rect;
	
	var data_foldout: boolean = true;
	var scale: Vector3;
	
	var maps_foldout: boolean = false;
	
	var settings_foldout: boolean = false;
	var resolution_foldout: boolean = true;
	var scripts_foldout: boolean = false;
	var reset_foldout: boolean = false;
	var size_foldout: boolean = false;
	
	var raw_file_index: int = -1;
	var raw_save_file: raw_file_class = new raw_file_class();
	
	// resolutions
	var heightmap_resolution: int = 129;
	var splatmap_resolution: int = 128;
	var detail_resolution: int = 128;
	var detail_resolution_per_patch: int = 8;
	var basemap_resolution: int = 128;
	
	var size_synchronous: boolean = true;
	var resolutions_synchronous: boolean = true;
	var splat_synchronous: boolean = true;
	var tree_synchronous: boolean = true;
	var detail_synchronous: boolean = true;
	
	var splatmap_conversion: Vector2;
	var heightmap_conversion: Vector2;
	var detailmap_conversion: Vector2;
	
	var splat_foldout: boolean = false;
	var splat_length: int;
	var color_length: int;
	
	var tree_foldout: boolean = false;
	var tree_length: int;
	
	var detail_foldout: boolean = false;
	var detail_scale: float = 1;
	
	var base_terrain_foldout: boolean = true;
	var tree_detail_objects_foldout: boolean = true;
	var wind_settings_foldout: boolean = true;
	
	var settings_all_terrain: boolean = true;
	var heightmapPixelError: float = 5;
	var heightmapMaximumLOD: int = 0;
	var castShadows: boolean = false;
	var basemapDistance: float = 20000;
	var treeDistance: float = 20000;
	var detailObjectDistance: float = 250;
	var detailObjectDensity: float = 1;
	var treeMaximumFullLODCount: int = 50;
	var treeBillboardDistance: float = 250;
	var treeCrossFadeLength: float = 200;
	var draw: boolean = true;
	var editor_draw: boolean = true;
	
	var script_terrainDetail: TerrainDetail;
	// var script_triplanar: TriPlanarTerrainScript_TC;
	
	var settings_runtime: boolean = false;
	var settings_editor: boolean = true;
	
	var wavingGrassSpeed: float = 0.5;
	var wavingGrassAmount: float = 0.5;
	var wavingGrassStrength: float = 0.5;
	var wavingGrassTint: Color = Color(0.698,0.6,0.50);
	
	var neighbor: neighbor_class = new neighbor_class();
	
	function add_splatprototype(splat_number: int)
	{
		splatPrototypes.Insert(splat_number,new splatPrototype_class());
	}
	
	function erase_splatprototype(splat_number: int)
	{
	 	if (splatPrototypes.Count > 0){splatPrototypes.RemoveAt(splat_number);}
	}
	
	function clear_splatprototype()
	{
		splatPrototypes.Clear();
	}
	
	function add_treeprototype(tree_number: int)
	{
		treePrototypes.Insert(tree_number,new treePrototype_class());
	}
	
	function erase_treeprototype(tree_number: int)
	{
	 	if (treePrototypes.Count > 0){treePrototypes.RemoveAt(tree_number);}
	}
	
	function clear_treeprototype()
	{
		treePrototypes.Clear();
	}
	
	function add_detailprototype(detail_number: int)
	{
		detailPrototypes.Insert(detail_number,new detailPrototype_class());
	}
	
	function erase_detailprototype(detail_number: int)
	{
	 	if (detailPrototypes.Count > 0){detailPrototypes.RemoveAt(detail_number);}
	}
	
	function clear_detailprototype()
	{
		detailPrototypes.Clear();
	}
}

class neighbor_class
{
	var left: int = -1;
	var right: int = -1;
	var top: int = -1;
	var bottom: int = -1;
	
	var top_left: int = -1;
	var top_right: int = -1;
	var bottom_left: int = -1;
	var bottom_right: int = -1;
	var self: int;
}

class raw_file_class
{
	var assigned: boolean = false;
	var created: boolean = true;
	var file: String = String.Empty;
	var filename: String = String.Empty;
	var mode: raw_mode_enum = raw_mode_enum.Windows;
	var length: int;
	var resolution: Vector2;
	var square: boolean = true;
	var loaded: boolean = false;
	
	var linked: boolean = true;
	
	var bytes: byte[];
	var fs: FileStream;
	var product1: float;
	var product2: float;
	
	function exists(): boolean
	{
		var file_info: FileInfo = new FileInfo(file);
	
		if (file_info.Exists){return true;} else {return false;}
	}
}

// detail_class
class detail_class
{
	var detail: int[,];
}

// map class
class map_class
{	var type: map_type_enum;
	var active: boolean = true;
	var button_parameters: boolean = true;
	var button_image_editor: boolean = true;
	var button_region: boolean = true;
	var button_image_export: boolean = true; 
	var button_heightmap_export: boolean = true; 
	var button_converter: boolean = false;
	var button_settings: boolean = true;
	var button_create_terrain: boolean = false;
	var button_help: boolean = false;
	var button_update: boolean = false;
	var alpha: float = 0.65;
	var backgroundColor: Color; 
	var titleColor: Color;
	var region_popup_edit: boolean = false;
	var area_popup_edit: boolean = false;
	var disable_region_popup_edit: boolean = false;
	var disable_area_popup_edit: boolean = false;
	
	var region: List.<map_region_class> = new List.<map_region_class>();
	var region_popup: String[];
	var region_select: int = 0;
	var manual_edit: boolean = false;
	
	var region_rect: Rect;
	var area_rect: Rect;
	
	var preimage_edit: preimage_edit_class = new preimage_edit_class();
	
	// var heights: float[,];
	var color_fault: Color;
	var tex1: Texture2D;
	var tex2: Texture2D;
	var tex3: Texture2D;
	var tex_swapped: boolean = false;
	var tex2_tile: tile_class = new tile_class();
	var tex3_tile: tile_class = new tile_class();
	var elExt_check: WWW;
	var elExt_check_loaded: boolean = false;
	var elExt_check_assign: boolean = false;

	var elExt: List.<ext_class> = new List.<ext_class>();
	var texExt: List.<ext_class> = new List.<ext_class>();
	
	var time_start_elExt: List.<float> = new List.<float>();
	var time_start_texExt: List.<float> = new List.<float>();
	
	var export_texExt: int = 8; 
	var export_elExt: int = 16;
	
	var mode: int = 0;
	
	var export_tex3: boolean = false;
	var export_heightmap_area: latlong_area_class = new latlong_area_class();
	var export_image_area: latlong_area_class = new latlong_area_class();
	
	var export_pullIndex: tile_class = new tile_class();
	var export_pulled: int;
	var export_image_active: boolean = false;
	var export_heightmap_active: boolean = false;
	var export_heightmap_zoom: int;
	var export_heightmap_timeStart: float;
	var export_heightmap_timeEnd: float;
	var export_heightmap_timePause: float;
	var export_heightmap_continue: boolean = true;
	
	var export_heightmap: map_export_class = new map_export_class();
	var export_image: map_export_class = new map_export_class();
	
	var export_image_zoom: int;
	var export_image_timeStart: float;
	var export_image_timeEnd: float;
	var export_image_timePause: float;
	var export_image_continue: boolean = true;
	var export_jpg_quality: int = 100; 
	var export_jpg: boolean = true;
	var export_png: boolean = false;
	var color: Color = Color.red;
	
	var key_edit: boolean = false;
	var bingKey: List.<map_key_class> = new List.<map_key_class>();
	var bingKey_selected: int = 0;
	
	var mouse_sensivity: float = 2;
	var path_display: boolean = false;
	
	function map_class()
	{
		make_region_popup();
	}
	
	function make_region_popup()
	{
		region_popup = new String[region.Count];
		
		for (var count_region: int = 0;count_region < region.Count;++count_region)
		{
			region_popup[count_region] = region[count_region].name;
		}	
	}
}

class map_export_class
{
	var last_tile: boolean = false;
	var tiles: tile_class = new tile_class();
	var tile: tile_class = new tile_class();
	var subtiles: tile_class = new tile_class();
	var subtile: tile_class = new tile_class();
	var subtiles_total: int;
	var subtile_total: int;
	var subtile2_total: int;
	
}

class map_key_class
{
	var pulls_startDay: int = 0;
	var pulls_startHour: int = 0;
	var pulls_startMinute: int = 0;
	var pulls: int = 0;
	var key: String;
	
	function reset()
	{
		pulls = 0;
		pulls_startDay = System.DateTime.Now.Day;
		pulls_startHour = System.DateTime.Now.Hour; 
		pulls_startMinute = System.DateTime.Now.Minute;
	}
}

class ext_class
{
	var pull: WWW;
	var loaded: boolean;
	var converted: boolean = false;
	var error: boolean = false;
	var tile: tile_class = new tile_class();
	var subtile: tile_class = new tile_class();
	var latlong_area: latlong_area_class = new latlong_area_class();
	var latlong_center: latlong_class = new latlong_class();
	var url: String; 
	var bres: Vector2;
	var zero_error: int = 0;
}

// map region class
class map_region_class
{ 
	var name: String = "Untitled";
	var area: List.<map_area_class> = new List.<map_area_class>();
	var area_popup: String[];
	var area_select: int = 0;
	var center: latlong_class = new latlong_class();
	
	function map_region_class(index: int)
	{
		name += index.ToString();
		// make_area_popup();
	}
	
	function make_area_popup()
	{
		area_popup = new String[area.Count];
		
		for (var count_area: int = 0;count_area < area.Count;++count_area)
		{
			area_popup[count_area] = area[count_area].name;
		}	
	}
}

class tile_class
{
	var x: int = 0;
	var y: int = 0;
	
	function tile_class()
	{
	
	}
	
	function tile_class(x1: int,y2: int)
	{
		x = x1;
		y = y2;
	}
	
	function reset()
	{
		x = 0;
		y = 0;
	}
}

// map area class
class map_area_class
{
	var name: String = "Untitled";
	
	var upper_left: latlong_class = new latlong_class();
	var lower_right: latlong_class = new latlong_class();
	var center: latlong_class = new latlong_class();
	var center_height: int;
	var size: map_pixel_class = new map_pixel_class();
	
	var created: boolean = false;
	// mode 0 -> Nothing
	// mode 1 -> Area Select
	// mode 2 -> Resize
	var resize: boolean = false;
	var resize_left: boolean = false;
	var resize_right: boolean = false;
	var resize_top: boolean = false;
	var resize_bottom: boolean = false;
	var resize_topLeft: boolean = false;
	var resize_topRight: boolean = false;
	var resize_bottomLeft: boolean = false;
	var resize_bottomRight: boolean = false;
	var resize_center: boolean = false;
	
	var manual_area: boolean = false;
	var heightmap_offset: Vector2 = new Vector2(0,0);
	
	var select: int = 0;
	var smooth_strength: float = 1;
	
	var width: float;
	var height: float; 
	
	var heightmap_resolution: Vector2;
	var heightmap_scale: double;
	var	heightmap_zoom: int = 0;
	var elevation_zoom: int;
	 
	var area_resolution: double;
	var resolution: int = 2048;
	var image_zoom: int = 18;
	var image_changed: boolean = false;
	
	var start_tile_enabled: boolean = false; 
	var start_tile: tile_class = new tile_class();
	var tiles: tile_class = new tile_class();
	
	var export_heightmap_active: boolean = false;
	var export_heightmap_call: boolean = false;
	var export_heightmap_path: String = String.Empty;
	var export_heightmap_filename: String = String.Empty;
	var export_heightmap_changed: boolean = false;
	var export_heightmap_not_fit: boolean = false;  
	var export_heightmap_bres: Vector2;
	
	var export_image_active: boolean = false;
	var export_image_call: boolean = false;
	var export_image_path: String = String.Empty;
	var export_image_filename: String = String.Empty;
	var export_image_changed: boolean = false;
	var export_image_import_settings: boolean = false;
	var export_image_world_file: boolean = false;
	
	var export_terrain_path: String = String.Empty;
	var export_terrain_changed: boolean = false;
	var export_to_terraincomposer: boolean = true;
	var import_heightmap_path_full: String;
	var import_heightmap: boolean = false;
	var filter_perlin: boolean = false;
	
	var converter_source_path_full: String = String.Empty;
	var converter_destination_path_full: String = String.Empty; 
	var converter_resolution: Vector2; 
	var converter_height: float = 9000;
	var converter_import_heightmap: boolean = false; 
	
	var terrain_asset_name: String = String.Empty;
	var terrain_scene_name: String = String.Empty;
	var terrain_name_changed: boolean = false;
	 
	var terrain_height: float = 9000;
	var terrain_scale: float = 1;
	var terrain_curve: AnimationCurve;
	var do_heightmap: boolean = true;
	var do_image: boolean = true;
	var terrain_heightmap_resolution_select: int;
	var terrain_heightmap_resolution: int;
	var terrain_heightmap_resolution_changed: boolean = false;
	var mipmapEnabled: boolean = true;
	var terrain_done: boolean = false;
	#if UNITY_EDITOR
	var filterMode: FilterMode = FilterMode.Trilinear;
	#endif
	var anisoLevel: int = 9; 
	var maxTextureSize: int;
	var maxTextureSize_select: int = 6;
	var maxTextureSize_changed: boolean = false;
	var auto_import_settings_apply = true;
	#if UNITY_EDITOR
	var textureFormat: TextureImporterFormat = TextureImporterFormat.AutomaticCompressed;
	#endif
	
	// var preimage_active: boolean = false;
	var preimage_export_active: boolean = false;
	var preimage_apply: boolean = false;
	var preimage_save_new: boolean = true;
	var preimage_path: String = String.Empty; 
	var preimage_path_changed: boolean = false;
	var preimage_filename: String;
	var preimage_count: int;
		
	function map_area_class(name1: String,index: int)
	{
		name = name1+index.ToString();
		
		terrain_curve = new AnimationCurve.Linear(0,0,0.89,0.89);
		terrain_curve.AddKey(1,0);
		terrain_curve = set_curve_linear(terrain_curve);
	}
	
	function reset()
	{
		upper_left.reset();
		lower_right.reset();
		center.reset();
		size.reset();
	}
	
	function set_curve_linear(curve: AnimationCurve): AnimationCurve
	{
		var curve3: AnimationCurve = new AnimationCurve();
		for (var count_key: int = 0;count_key < curve.keys.Length;++count_key)
		{
			var intangent: float = 0;
			var outtangent: float = 0;
			var intangent_set: boolean = false;
			var outtangent_set: boolean = false;
			var point1: Vector2;
			var point2: Vector2;
			var deltapoint: Vector2;
			var key: Keyframe = curve[count_key];
			
			if (count_key == 0){intangent = 0;intangent_set = true;}
			if (count_key == curve.keys.Length -1){outtangent = 0;outtangent_set = true;}
			
			if (!intangent_set)
			{
				point1.x = curve.keys[count_key-1].time;
				point1.y = curve.keys[count_key-1].value;
				point2.x = curve.keys[count_key].time;
				point2.y = curve.keys[count_key].value;
					
				deltapoint = point2-point1;
				
				intangent = deltapoint.y/deltapoint.x;
			}
			if (!outtangent_set)
			{
				point1.x = curve.keys[count_key].time;
				point1.y = curve.keys[count_key].value;
				point2.x = curve.keys[count_key+1].time;
				point2.y = curve.keys[count_key+1].value;
					
				deltapoint = point2-point1;
						
				outtangent = deltapoint.y/deltapoint.x;
			}
					
			key.inTangent = intangent;
			key.outTangent = outtangent;
			curve3.AddKey(key);
		}
		return curve3;
	}
}

class preimage_edit_class
{
	var edit_color: List.<image_edit_class> = new List.<image_edit_class>();
	var y1: int;
	var x1: int;
	var x: int;
	var y: int;
	var frames: float;
	var auto_speed_time: float;
	var target_frame: float = 30;
	var generate: boolean = false;
	var loop: boolean = false;
	var generate_call: boolean = false;
	var active: boolean = true;
	var loop_active: boolean = true;
	var import_settings: boolean = false;
		
	function convert_texture(texture1: Texture2D,texture2: Texture2D,width: float,height: float,multithread: boolean)
	{
		var count_color: int = 0;
		var color: Color;
		var color2: Color; 
		// var width: float = texture1.width;
		// var height: float = 768;//texture1.height;
		var color_pos1: float;
		var color_pos2: float;
		var strength: float;
		
		// frames = 1/(Time.realtimeSinceStartup-auto_speed_time);
 		auto_speed_time = Time.realtimeSinceStartup; 
		
		for (y = y1;y < height;++y) {
			for (x = 0;x < width;++x) {
				color = texture1.GetPixel(x,y);
				
				for (count_color = 0;count_color < edit_color.Count;++count_color) {
					if ((edit_color[count_color].active || edit_color[count_color].solid_color) && active) {
						color_pos1 = calc_color_pos(color,edit_color[count_color].color1_start,edit_color[count_color].color1_end);
						if (color_pos1 != -1) {
							color_pos1 = edit_color[count_color].curve1.Evaluate(color_pos1);
							color_pos2 = edit_color[count_color].curve2.Evaluate(color_pos1);
							color2 = calc_color_from_pos(color_pos2,edit_color[count_color].color2_start,edit_color[count_color].color2_end);
							strength = edit_color[count_color].strength;
							
							if (!edit_color[count_color].solid_color) {
								switch (edit_color[count_color].output)
								{
									case condition_output_enum.add:
										color.r += color2.r*strength;
										color.g += color2.g*strength;
										color.b += color2.b*strength;
										break;
									case condition_output_enum.subtract:
										color.r -= color2.r*strength;
										color.g -= color2.g*strength;
										color.b -= color2.b*strength;
										break;
									case condition_output_enum.change:
										color.r = (color.r*(1-strength))+color2.r*strength;
										color.g = (color.g*(1-strength))+color2.g*strength;
										color.b = (color.b*(1-strength))+color2.b*strength;
										break;
									case condition_output_enum.multiply:
										color.r *= (color2.r*strength);
										color.g *= (color2.g*strength);
										color.b *= (color2.b*strength); 
										break;
									case condition_output_enum.devide:
										if ((color2.r*strength) != 0) {
											color.r = color.r/(color2.r*strength);}
										if ((color2.g*strength) != 0) {
											color.g = color.g/(color2.g*strength);}
										if ((color2.b*strength) != 0) {
											color.b = color.b/(color2.b*strength);}
										break;
									case condition_output_enum.difference:
										color.r = Mathf.Abs((color2.r*strength)-color.r);
										color.g = Mathf.Abs((color2.g*strength)-color.g);
										color.b = Mathf.Abs((color2.b*strength)-color.b);
										break;
									case condition_output_enum.average:
										color.r = (color.r+(color2.r*strength))/2;
										color.g = (color.g+(color2.g*strength))/2;
										color.b = (color.b+(color2.b*strength))/2;
										break;
									case condition_output_enum.max:
										if (color2.r*strength > color.r) {color.r = color2.r*strength;}
										if (color2.g*strength > color.g) {color.g = color2.g*strength;}
										if (color2.b*strength > color.b) {color.b = color2.b*strength;}
										break;
									case condition_output_enum.min:
										if (color2.r*strength < color.r) {color.r = color2.r*strength;}
										if (color2.g*strength < color.g) {color.g = color2.g*strength;}
										if (color2.b*strength < color.b) {color.b = color2.b*strength;}
										break;
								}			
							}
							else {
								color.r += 1-color_pos1;
								color.g += color_pos1;
								color.b += 1;
							}
						}
					}
				}
				texture2.SetPixel (x,y,color);
			}
			if (Time.realtimeSinceStartup-auto_speed_time > (1.0/target_frame) && multithread)
			{
				y1 = y+1;
				return;
			}
		}
		generate = false; 
	}
	
	function calc_color_pos(color: Color,color_start: Color,color_end: Color): float
	{
		var color_start2: Color = color_start;
		var color_range: Color;
		if (color_start.r > color_end.r){color_start.r = color_end.r;color_end.r = color_start2.r;}
		if (color_start.g > color_end.g){color_start.g = color_end.g;color_end.g = color_start2.g;}
		if (color_start.b > color_end.b){color_start.b = color_end.b;color_end.b = color_start2.b;}
		color_range = color_end - color_start;
		color -= color_start;
		if (color.r < 0 || color.g < 0 || color.b < 0){return -1;}
		if (color.r > color_range.r || color.g > color_range.g || color.b > color_range.b){return -1;}
			
		var color_range_total: float = (color_range.r+color_range.g+color_range.b);
		var color_total: float = (color.r+color.g+color.b);
		if (color_range_total != 0){return (color_total/color_range_total);} else {return 1;}
	}
	
	function calc_color_from_pos(pos: float,color_start: Color,color_end: Color): Color
	{
		var color_start2: Color = color_start;
		var color_range: Color;
		if (color_start.r > color_end.r){color_start.r = color_end.r;color_end.r = color_start2.r;}
		if (color_start.g > color_end.g){color_start.g = color_end.g;color_end.g = color_start2.g;}
		if (color_start.b > color_end.b){color_start.b = color_end.b;color_end.b = color_start2.b;}
		color_range = color_end - color_start;
		
		var color: Color = color_start+Color(color_range.r*pos,color_range.g*pos,color_range.b*pos);
		// if (color_range_total != 0){return (color_total/color_range_total);} else {return 1;}
		return color;
	}
	
	function swap_color(color_index1: int,color_index2: int) 
	{
		var color3: image_edit_class = edit_color[color_index1];
		
		edit_color[color_index1] = edit_color[color_index2];
		edit_color[color_index2] = color3;
	}
	
	function copy_color(color_index1: int,color_index2: int)
	{
		edit_color[color_index1].color1_start = edit_color[color_index2].color1_start;
		edit_color[color_index1].color1_end = edit_color[color_index2].color1_end;
		edit_color[color_index1].curve1 = edit_color[color_index2].curve1;
		edit_color[color_index1].color2_start = edit_color[color_index2].color2_start;
		edit_color[color_index1].color2_end = edit_color[color_index2].color2_end;
		edit_color[color_index1].curve2 = edit_color[color_index2].curve2;
		edit_color[color_index1].strength = edit_color[color_index2].strength;
		edit_color[color_index1].output = edit_color[color_index2].output;
		edit_color[color_index1].active = edit_color[color_index2].active;
		edit_color[color_index1].solid_color = edit_color[color_index2].solid_color;
	}
}

class image_edit_class
{
	var color1_start: Color = new Color(0,0,0,1);
	var color1_end: Color = new Color(0.3,0.3,0.3,1);
	var curve1: AnimationCurve = new AnimationCurve.Linear(0,0,1,1);
	
	var color2_start: Color = new Color(1,1,1,1);
	var color2_end: Color = new Color(1,1,1,1);
	var curve2: AnimationCurve = new AnimationCurve.Linear(0,0,1,1);;
	
	var strength: float = 1;
	var output: condition_output_enum;
	var active: boolean = true;
	var solid_color: boolean = false;
}

class select_window_class
{
	var active: boolean = false; 
	var button_colormap: boolean = false;
	var button_node: boolean = false;
	var button_terrain: boolean = false;
	var button_heightmap: boolean = true;
	var terrain_zoom: float = 40;
	var terrain_zoom2: float = 40;
	var terrain_pos: Vector2 = new Vector2(0,0);
	
	var node_zoom: float = 40;
	var node_zoom2: float = 40;
	var node_pos: Vector2 = new Vector2(0,0);
	var node_grid: boolean = true;
	var node_grid_center: boolean = true;
	
	var mode: int;
	
	// mode 0 -> Activate terrains Scene
	// mode 1 -> Activate terrains generate
	// mode 2 -> Resize tiles
	
	var terrain_offset: Vector2 = new Vector2(0,0);
	var node_offset: Vector2 = new Vector2(0,0);
	
	function select_colormap() {
		button_node = false;
		button_colormap = true;
		button_terrain = false;
	}
	
	function select_terrain() {
		button_node = false;
		button_colormap = false;
		button_terrain = true;
	}
	
	function select_node() {
		button_node = true;
		button_colormap = false;
		button_terrain = false;
	}
}

class map_pixel_class
{
	var x: double;
	var y: double;
	
	function reset()
	{
		x = 0;
		y = 0;
	}
}

class latlong_class
{
	var latitude: double;
	var longitude: double;
	
	function latlong_class()
	{
	
	}
	
	function latlong_class(latitude1: double,longitude1: double)
	{
		latitude = latitude1;
		longitude = longitude1;
	}
	
	function reset()
	{
		latitude = 0;
		longitude = 0;
	}
}

class latlong_area_class
{
	var latlong1: latlong_class = new latlong_class();
	var latlong2: latlong_class = new latlong_class();
}

class remarks_class
{
	var textfield_foldout: boolean = false;
	var textfield_length: int = 1;
	var textfield: String = String.Empty;
}

class auto_search_class
{
	var path_full: String = String.Empty;
	var path: String = String.Empty;
	var foldout: boolean = false;
	var custom: boolean = false;
	var digits: int = 1;
	var format: String = "%n";
    var filename: String = "tile";
    var fullname: String;
    var name: String;
    var extension: String = ".raw";
    var start_x: int = 0;
    var start_y: int = 0;
    var start_n: int = 1;
    var count_x: int = 1;
    var count_y: int = 1;
    var display: boolean = false;
    
    var select_index: int = 0;
    
    var menu_rect: Rect;
    
    var output_format: String = "1";
    
    function set_output_format()
    {
    	var digit: String = new String("0"[0],digits);
    	output_format = format.Replace("%x",start_x.ToString(digit));
		output_format = output_format.Replace("%y",start_y.ToString(digit));
		output_format = output_format.Replace("%n",start_n.ToString(digit));
    }
    
	function strip_file(): boolean
	{
		var digit: String = new String("0"[0],digits);
		
		var format: String = format.Replace("%x",start_x.ToString(digit));
		format = format.Replace("%y",start_y.ToString(digit));
		format = format.Replace("%n",start_n.ToString(digit));
		
		if (path_full.Length == 0) {return false;}
		path = Path.GetDirectoryName(path_full);
		filename = Path.GetFileNameWithoutExtension(path_full).Replace(format,String.Empty);
		extension = Path.GetExtension(path_full);
		return true;
	}
	
	function strip_name()
	{
		var digit: String = new String("0"[0],digits);
		
		var format1: String = format.Replace("%x",start_x.ToString(digit));
		format1 = format1.Replace("%y",start_y.ToString(digit));
		format1 = format1.Replace("%n",start_n.ToString(digit));
		
		// name = Regex.Replace(fullname,"[0-9]","");
		name = fullname;
		if (format1.Length > 0){name = name.Replace(format1,String.Empty);}
	}
	
	function get_file(count_x: int,count_y: int,count_n: int): String
	{
		var format2: String;
		var digit: String = new String("0"[0],digits);
		var filename2: String;
						
		format2 = format.Replace("%x",(count_x+start_x).ToString(digit));
		format2 = format2.Replace("%y",(count_y+start_y).ToString(digit));
		format2 = format2.Replace("%n",(count_n+start_n).ToString(digit));
		
		filename2 = path+"/"+filename+format2+extension;
		
		return filename2;
	}
	
	function get_name(count_x: int,count_y: int,count_n: int): String
	{
		var format2: String;
		var digit: String = new String("0"[0],digits);
		var name2: String;
						
		format2 = format.Replace("%x",(count_x+start_x).ToString(digit));
		format2 = format2.Replace("%y",(count_y+start_y).ToString(digit));
		format2 = format2.Replace("%n",(count_n+start_n).ToString(digit));
		
		name2 = name+format2;
		
		return name2;
	}
}

// area_class
class area_class
{
	var active: boolean = true;
	var foldout: boolean = false;
	var area: Rect;
	var area_old: Rect;
	var area_max: Rect;
	var center: Vector2;
	var image_offset: Vector2;
	var rotation: Vector3;
	var rotation_active: boolean = false;
	var link_start: boolean = true;
	var link_end: boolean = true;
	
	var resolution: float;
	var custom_resolution: float;
	var step: Vector2;
	var step_old: Vector2;
	var conversion_step: Vector2;
	var resolution_mode: resolution_mode_enum = resolution_mode_enum.Automatic;
	var resolution_mode_text: String;
	var resolution_tooltip_text: String;
	
	var tree_resolution: int = 512;
	var object_resolution: int = 512;
	var tree_resolution_active: boolean = false;
	var object_resolution_active: boolean = false;
	
	function max()
	{
		area = area_max;
	}
	
	function round_area_to_step(area1: Rect): Rect
	{
		area1.xMin = Mathf.Round(area1.xMin/step.x)*step.x;
		area1.xMax = Mathf.Round(area1.xMax/step.x)*step.x;
		area1.yMin = Mathf.Round(area1.yMin/step.y)*step.y;
		area1.yMax = Mathf.Round(area1.yMax/step.y)*step.y;
		
		return area1;
	}
	
	function set_resolution_mode_text()
	{
		if (area == area_max)
		{
			resolution_mode_text = "M";
			resolution_tooltip_text = "Maximum Area Selected";
		} 
		else 
		{
			resolution_mode_text = "C";
			resolution_tooltip_text = "Custum Area Selected";
		}
		
		if (resolution_mode == resolution_mode_enum.Automatic){resolution_mode_text += "-> A";resolution_tooltip_text += "\n\nStep Mode is on Automatic";}
		else if (resolution_mode == resolution_mode_enum.Heightmap){resolution_mode_text += "-> H";resolution_tooltip_text += "\n\nStep Mode is on Heightmap";}
		else if (resolution_mode == resolution_mode_enum.Splatmap){resolution_mode_text += "-> S";resolution_tooltip_text += "\n\nStep Mode is on Splatmap";}
		else if (resolution_mode == resolution_mode_enum.Detailmap){resolution_mode_text += "-> D";resolution_tooltip_text += "\n\nStep Mode is on Detailmap";}
		else if (resolution_mode == resolution_mode_enum.Tree){resolution_mode_text += "-> T";resolution_tooltip_text += "\n\nStep Mode is on Tree";}
		else if (resolution_mode == resolution_mode_enum.Object){resolution_mode_text += "-> O";resolution_tooltip_text += "\n\nStep Mode is on Object";}
		else if (resolution_mode == resolution_mode_enum.Units){resolution_mode_text += "-> U";resolution_tooltip_text += "\n\nStep Mode is on Units";}
		else if (resolution_mode == resolution_mode_enum.Custom){resolution_mode_text += "-> C";resolution_tooltip_text += "\n\nStep Mode is on Custom";}
	}
}

class splatPrototype_class
{
	var foldout: boolean = false;
	var texture: Texture2D;
	var tileSize: Vector2 = Vector2(10,10);
	var tileSize_link: boolean = true;
	var tileSize_old: Vector2;
	var tileOffset: Vector2 = Vector2(0,0);
	
	var normal_tileSize: Vector2 = Vector2(10,10);
	var strength: float = 1;
    var strength_splat: float = 1;
    var normal_texture: Texture2D;
	var normalMap: Texture2D;
	var specular_texture: Texture2D;	
	
	var import_max_size_list: int;
}

class treePrototype_class
{
	var prefab: GameObject;
	var texture: Texture2D;
	var bendFactor: float = 0.3;
	var foldout: boolean = false;
}

class detailPrototype_class
{
	var foldout: boolean = false;
	var prototype: GameObject;
	var prototypeTexture: Texture2D;
	var minWidth: float = 1;
	var maxWidth: float = 2;
	var minHeight: float = 1;
	var maxHeight: float = 2;
	var noiseSpread: float = 0.1;
	var bendFactor: float;
	var healthyColor: Color = Color.white;
	var dryColor: Color = Color(0.8,0.76,0.53);
	var renderMode: DetailRenderMode = DetailRenderMode.Grass;
}

class color_settings_class
{
	var backgroundColor: Color = Color (0,0,0,0.5);
	var backgroundActive: boolean = true;
	
	var color_description: Color = Color(1,0.45,0);
	var color_layer: Color = Color.yellow;
	var color_filter: Color = Color.cyan;
	var color_subfilter: Color = Color.green;
	var color_colormap: Color = Color.white;
	var color_splat: Color = Color.white;
	var color_tree: Color = Color(1,0.7,0.4);
	var color_tree_precolor_range: Color = Color(1,0.84,0.64);
	var color_tree_filter: Color = Color(0.5,1,1);
	var color_tree_subfilter: Color = Color(0.5,1,0.5);
	var color_grass: Color = Color.white;
	var color_object: Color = Color.white;
	var color_terrain: Color = Color.white;
}

function drawText(text: String,pos: Vector2,background: boolean,color: Color,backgroundColor: Color,rotation: float,fontSize: float,bold: boolean,mode: int): Vector2
{
	// mode
	// 1 -> allign leftTop
	// 2- > allign centerBottom
	// 3- > alling rightBottom
	// 4- > allign center
	// 5- > allign rightTop
	// 6 -> allign leftBottom
	
	var m1: Matrix4x4 = Matrix4x4.identity; 
	var m2: Matrix4x4 = Matrix4x4.identity;
	
	var old_fontSize: int = GUI.skin.label.fontSize;
	var old_fontStyle: FontStyle = GUI.skin.label.fontStyle;
	var color_old: Color = GUI.color;
 	
	GUI.skin.label.fontSize = fontSize;
	if (bold){GUI.skin.label.fontStyle = FontStyle.Bold;}
	 else {GUI.skin.label.fontStyle = FontStyle.Normal;}
	
	var size: Vector2 =  GUI.skin.GetStyle("Label").CalcSize(GUIContent(text));
	
	m2.SetTRS(Vector3(pos.x,pos.y,0),Quaternion.Euler(0,0,rotation),Vector3.one);
    
	switch (mode)
	{
	    case 1: 
	    	GUI.matrix = m2;
	    	break;
	    case 2:        
			m1.SetTRS(Vector3(-size.x/2,-size.y,0),Quaternion.identity,Vector3.one);
			GUI.matrix = m2*m1;
			break;
		case 3:	
			m1.SetTRS(Vector3(0,-size.y,0),Quaternion.identity,Vector3.one);
			GUI.matrix = m2*m1;
			break;
		case 4:        
			m1.SetTRS(Vector3(-size.x/2,-size.y/2,0),Quaternion.identity,Vector3.one);
			GUI.matrix = m2*m1;
			break;
		case 5: 
	    	m1.SetTRS(Vector3(-size.x,0,0),Quaternion.identity,Vector3.one);
	    	GUI.matrix = m2*m1;
	    	break;
	    case 6: 
	    	m1.SetTRS(Vector3(-size.x,-size.y,0),Quaternion.identity,Vector3.one);
	    	GUI.matrix = m2*m1;
	    	break;
	}
	 
 	if (background)
	{ 
		GUI.color = backgroundColor;
		#if UNITY_EDITOR
		EditorGUI.DrawPreviewTexture(Rect(0,0,size.x,size.y),tex1);
		#endif
	}
 	
 	GUI.color = color;
	GUI.Label(new Rect(0,0,size.x,size.y),text);
	
	GUI.skin.label.fontSize = old_fontSize;
	GUI.skin.label.fontStyle = old_fontStyle;
	GUI.color = color_old;	 
	GUI.matrix = Matrix4x4.identity;
	
	return size;
}

function drawText(rect: Rect,edit: edit_class,background: boolean,color: Color,backgroundColor: Color,fontSize: float,bold: boolean,mode: int): boolean
{
	// mode
	// 1 -> allign leftTop
	// 2- > allign centerBottom
	// 3- > alling leftBottom
	// 4- > allign center
	// 5- > allign rightTop
	// 6- > allign centerTop
	
	var pos: Vector2;
	
	var old_fontSize: int; 
	var old_fontStyle: FontStyle;
	var color_old: Color = GUI.color;
 	
	var size: Vector2; 
	
	if (background)
	{ 
		GUI.color = backgroundColor;
		#if UNITY_EDITOR
		EditorGUI.DrawPreviewTexture(Rect(pos.x,pos.y,size.x,size.y),tex1);
		#endif
	}
 	
 	GUI.color = color;
 	
 	if (!edit.edit) {
 		old_fontSize = GUI.skin.label.fontSize;
		old_fontStyle = GUI.skin.label.fontStyle;
		
 		GUI.skin.label.fontSize = fontSize;
		
		if (bold){GUI.skin.label.fontStyle = FontStyle.Bold;}
			else {GUI.skin.label.fontStyle = FontStyle.Normal;}
		
		size =  GUI.skin.GetStyle("Label").CalcSize(GUIContent(edit.default_text));
		
		pos = calc_rect_allign(rect,size,mode);
		
		GUI.Label(new Rect(pos.x,pos.y,size.x,size.y),edit.default_text);
		
		GUI.skin.label.fontSize = old_fontSize;
		GUI.skin.label.fontStyle = old_fontStyle;
	}
	else {
		old_fontSize = GUI.skin.textField.fontSize;
		old_fontStyle = GUI.skin.textField.fontStyle;
		
		GUI.skin.textField.fontSize = fontSize;
		
		if (bold){GUI.skin.textField.fontStyle = FontStyle.Bold;}
			else {GUI.skin.textField.fontStyle = FontStyle.Normal;}
		
		size =  GUI.skin.GetStyle("TextField").CalcSize(GUIContent(edit.text));
		if (size.x < rect.width){size.x = rect.width;}
		size.x += 10;
		
		pos = calc_rect_allign(rect,size,mode);
		edit.text = GUI.TextField(new Rect(pos.x,pos.y,size.x,size.y),edit.text);
		
		GUI.skin.textField.fontSize = old_fontSize;
		GUI.skin.textField.fontStyle = old_fontStyle;
	}
	
	if (Event.current.button == 0 && Event.current.clickCount == 2 && Event.current.type == EventType.MouseDown) {
		if (Rect(pos.x,pos.y,size.x,size.y).Contains(Event.current.mousePosition)) {
			edit.edit = !edit.edit;
		}
	}
	
	if (Event.current.keyCode == KeyCode.Return || Event.current.keyCode == KeyCode.Escape){
		edit.edit = false;
		GUI.color = color_old;
		return true;
	}
	
	GUI.color = color_old;	 
	return false;
}

function drawText(rect: Rect,text: String,background: boolean,color: Color,backgroundColor: Color,fontSize: float,bold: boolean,mode: int)
{
	// mode
	// 1 -> allign leftTop
	// 2- > allign centerBottom
	// 3- > alling leftBottom
	// 4- > allign center
	// 5- > allign rightTop
	// 6- > allign centerTop
	
	var pos: Vector2;
	
	var old_fontSize: int = GUI.skin.label.fontSize; 
	var old_fontStyle: FontStyle = GUI.skin.label.fontStyle;
	var color_old: Color = GUI.color;
 	
	var size: Vector2; 
	
	if (background)
	{ 
		GUI.color = backgroundColor;
		#if UNITY_EDITOR
		EditorGUI.DrawPreviewTexture(Rect(pos.x,pos.y,size.x,size.y),tex1);
		#endif
	}
 	
 	GUI.color = color;
 	
	GUI.skin.label.fontSize = fontSize;
	
	if (bold){GUI.skin.label.fontStyle = FontStyle.Bold;}
		else {GUI.skin.label.fontStyle = FontStyle.Normal;}
	
	size =  GUI.skin.GetStyle("Label").CalcSize(GUIContent(text));
	
	pos = calc_rect_allign(rect,size,mode);
	
	GUI.Label(new Rect(pos.x,pos.y,size.x,size.y),text);
	
	GUI.skin.label.fontSize = old_fontSize;
	GUI.skin.label.fontStyle = old_fontStyle;
	
	GUI.color = color_old;	 
}

function calc_rect_allign(rect: Rect,size: Vector2,mode: int): Vector2
{
	var pos: Vector2;
	
	switch (mode)
	{
	    case 1: 
	    	pos.x = rect.x;
	    	pos.y = rect.y;
	    	break;
	    case 2:        
	    	pos.x = rect.x+(rect.width/2)-(size.x/2);
	    	pos.y = rect.yMax;
			break;
		case 3:	
			pos.x = rect.x;
			pos.y = rect.yMax;
			break;
		case 4:        
			pos.x = rect.x+(rect.width/2)-(size.x/2);
			pos.y = rect.y+(rect.height/2)-(size.y/2);
			break;
		case 5: 
			pos.x = rect.xMax-size.x;
			pos.y = rect.y;
	    	break;
	    case 6: 
	    	pos.x = rect.x+(rect.width/2)-(size.x/2);
	    	pos.y = rect.y-size.y;
	    	break;
	}
	
	return pos;
}

function drawGUIBox(rect: Rect,edit: edit_class,fontSize: float,label2: boolean,labelHeight: float,backgroundColor: Color,highlightColor: Color,highlightColor2: Color,textColor: Color,border: boolean,width: int,screen: Rect,select: boolean,select_color: Color,active: boolean): boolean
{
	if (!select) {
		highlightColor += Color(-0.3,-0.3,-0.3);
		highlightColor2 += Color(-0.3,-0.3,-0.3);
	}
	
	// GUI.color = backgroundColor;
	// EditorGUI.DrawPreviewTexture(Rect(rect.x,rect.y,rect.width,rect.height),tex1);
	GUI.color = highlightColor;
	#if UNITY_EDITOR
	EditorGUI.DrawPreviewTexture(Rect(rect.x,rect.y,rect.width,labelHeight),tex1);
	#endif
	
	var repaint: boolean = drawText(rect,edit,false,textColor,Color(0.1,0.1,0.1,1),fontSize,true,6);
	
	if (label2) {
		GUI.color = highlightColor2;
		#if UNITY_EDITOR
		EditorGUI.DrawPreviewTexture(Rect(rect.x,rect.yMax-labelHeight,rect.width,labelHeight),tex1);
		#endif
		GUI.color = Color.white;
		
		if (!active) {
			Drawing_tc.DrawLine(Vector2(rect.x+1,rect.y+labelHeight+1),Vector2(rect.xMax-1,rect.yMax-labelHeight-1),Color(1,0,0,0.7),3,false,screen);
			Drawing_tc.DrawLine(Vector2(rect.x+1,rect.yMax-labelHeight-1),Vector2(rect.xMax-1,rect.y+labelHeight+1),Color(1,0,0,0.7),3,false,screen);
		}
	} 
	else if (!active) {
		Drawing_tc.DrawLine(Vector2(rect.x+1,rect.y+labelHeight+1),Vector2(rect.xMax-1,rect.yMax-1),Color(1,0,0,0.7),3,false,screen);
		Drawing_tc.DrawLine(Vector2(rect.x+1,rect.yMax-1),Vector2(rect.xMax-1,rect.y+labelHeight+1),Color(1,0,0,0.7),3,false,screen);
	}
	
	if (border) {
		DrawRect(rect,highlightColor,width,screen);
		Drawing_tc.DrawLine(Vector2(rect.x,rect.y+labelHeight),Vector2(rect.xMax,rect.y+labelHeight),highlightColor,width,false,screen);
		if (label2) {Drawing_tc.DrawLine(Vector2(rect.x,rect.yMax-labelHeight),Vector2(rect.xMax,rect.yMax-labelHeight),highlightColor,width,false,screen);}
		//Drawing_tc.DrawLine(Vector2(rect.x,rect.yMax),Vector2(rect.xMax,rect.yMax),highlightColor,width,false,screen);
		//Drawing_tc.DrawLine(Vector2(rect.xMax-1,rect.y),Vector2(rect.xMax-1,rect.yMax),highlightColor,width,false,screen);
	}
	
	GUI.color = Color.white;
	
	return repaint;
}

function drawJoinNode(rect: Rect,length: int,text: String,fontSize: float,label2: boolean,labelHeight: float,backgroundColor: Color,highlightColor: Color,highlightColor2: Color,textColor: Color,border: boolean,width: int,screen: Rect,select: boolean,select_color: Color,active: boolean)
{
	if (!select) {
		highlightColor += Color(-0.3,-0.3,-0.3);
		highlightColor2 += Color(-0.3,-0.3,-0.3);
	}
	
		// GUI.color = backgroundColor;
	// EditorGUI.DrawPreviewTexture(Rect(rect.x,rect.y,rect.width,rect.height),tex1);
	GUI.color = highlightColor;
	var count: int = 0;
	
	for (count = 0;count < length;++count) {
		#if UNITY_EDITOR
		EditorGUI.DrawPreviewTexture(Rect(rect.x,rect.y+(count*select_window.node_zoom),rect.width,labelHeight),tex1);
		#endif
	}
	
	for (count = 0;count < length;++count) {
		if (count < length-1) {Drawing_tc.DrawLine(Vector2(rect.x,rect.y+((count+1)*select_window.node_zoom)),Vector2(rect.xMax,rect.y+((count+1)*select_window.node_zoom)),highlightColor,width,false,screen);}
	}
	
	drawText(rect,text,false,textColor,Color(0.1,0.1,0.1,1),fontSize,true,6);
	
	if (border) {
		DrawRect(Rect(rect.x,rect.y,rect.width,length*select_window.node_zoom),highlightColor,width,screen);
		//Drawing_tc.DrawLine(Vector2(rect.x,rect.yMax),Vector2(rect.xMax,rect.yMax),highlightColor,width,false,screen);
		//Drawing_tc.DrawLine(Vector2(rect.xMax-1,rect.y),Vector2(rect.xMax-1,rect.yMax),highlightColor,width,false,screen);
	}
	
	GUI.color = Color.white;
}

function get_label_width(text: String, bold: boolean): int
{
	var size: Vector2;
	
	if (bold) {
		var old_fontStyle: FontStyle = GUI.skin.label.fontStyle;
		GUI.skin.label.fontStyle = FontStyle.Bold;
		
		size =  GUI.skin.GetStyle("Label").CalcSize(GUIContent(text));
		GUI.skin.label.fontStyle = old_fontStyle;
	}
	else {
		size =  GUI.skin.GetStyle("Label").CalcSize(GUIContent(text));
	}
	return size.x;
}

function DrawRect(rect: Rect,color: Color,width: float,screen: Rect)
{
	/*
	var xmin0: boolean = false;
	var ymin0: boolean = false;
	var xmax0: boolean = false;
	var ymax0: boolean = false;
	
	var xmin1: boolean = false;
	var ymin1: boolean = false;
	var xmax1: boolean = false;
	var ymax1: boolean = false;
	
	if (rect.xMin < 0){rect.xMin = 0;xmin0 = true;}
	else if (rect.xMin > screen_resolution.x){rect.xMin = screen_resolution.x;xmin1 = true;}
	if (rect.yMin < 0){rect.yMin = 0;ymin0 = true;}
	else if (rect.yMin > screen_resolution.y){rect.yMin = screen_resolution.y;ymin1 = true;}
	if (rect.xMax < 0){rect.xMax = 0;xmax0 = true;}
	else if (rect.xMax > screen_resolution.x){rect.xMax = screen_resolution.x;xmax1 = true;}
	if (rect.yMax < 0){rect.yMax = 0;ymax0 = true;}
	else if (rect.yMax > screen_resolution.y){rect.yMax = screen_resolution.y;ymax1 = true;}
	
	if ((xmin0 && xmax0) || (xmin1 && xmax1)){return;}
	if ((ymin0 && ymax0) || (ymin1 && ymin1)){return;}
	
	if (!ymin0){Drawing_tc.DrawLine(Vector2(rect.x,rect.y),Vector2(rect.xMax,rect.y),color,width,false,Rect(0,0,screen.width,screen.height));}
	if (!xmin0){Drawing_tc.DrawLine(Vector2(rect.x,rect.y),Vector2(rect.x,rect.yMax),color,width,false,Rect(0,0,screen.width,screen.height));}
	if (!ymax1){Drawing_tc.DrawLine(Vector2(rect.x,rect.yMax),Vector2(rect.xMax,rect.yMax),color,width,false,Rect(0,0,screen.width,screen.height));}
	if (!xmax1){Drawing_tc.DrawLine(Vector2(rect.xMax,rect.y),Vector2(rect.xMax,rect.yMax),color,width,false,Rect(0,0,screen.width,screen.height));}
	*/
	
	// Drawing_tc.DrawBox(rect,color,width);
	
	Drawing_tc.DrawLine(Vector2(rect.xMin,rect.yMin),Vector2(rect.xMax,rect.yMin),color,width,false,screen);
	Drawing_tc.DrawLine(Vector2(rect.xMin,rect.yMin),Vector2(rect.xMin,rect.yMax),color,width,false,screen);
	Drawing_tc.DrawLine(Vector2(rect.xMin,rect.yMax),Vector2(rect.xMax,rect.yMax),color,width,false,screen);
	Drawing_tc.DrawLine(Vector2(rect.xMax,rect.yMin),Vector2(rect.xMax,rect.yMax),color,width,false,screen);
	
}

function draw_arrow(point1: Vector2,length: int,length_arrow: int,rotation: float,color: Color,width: int,screen: Rect)
{
	length_arrow = Mathf.Sqrt(2.0)*length_arrow;
	
	var point2: Vector2 = calc_rotation_pixel(point1.x,point1.y-length,point1.x,point1.y,rotation);
	var point3: Vector2 = calc_rotation_pixel(point2.x-length_arrow,point2.y-length_arrow,point2.x,point2.y,-180+rotation);
	var point4: Vector2 = calc_rotation_pixel(point2.x+length_arrow,point2.y-length_arrow,point2.x,point2.y,180+rotation);
	
	Drawing_tc.DrawLine(point1,point2,color,width,false,screen);
	Drawing_tc.DrawLine(point2,point3,color,width,false,screen);
	Drawing_tc.DrawLine(point2,point4,color,width,false,screen);
}

function draw_latlong_raster(latlong1: latlong_class,latlong2: latlong_class,offset: Vector2,zoom: double,current_zoom: double,resolution: int,screen: Rect,color: Color,width: int): boolean
{
	var rounded: boolean = true;
	
	var p1: Vector2 = latlong_to_pixel(latlong1,map_latlong_center,current_zoom,Vector2(screen.width,screen.height));
	var p2: Vector2 = latlong_to_pixel(latlong2,map_latlong_center,current_zoom,Vector2(screen.width,screen.height));
	
	var pixel_resolution: Vector2 = p2-p1;
	
	p1 += Vector2(-offset.x,offset.y);
	p2 += Vector2(-offset.x,offset.y);
	
	// p1 -= screen_resolution/2;
	// p2 -= screen_resolution/2;
	
	var delta_zoom: double = Mathf.Pow(2,zoom-current_zoom);
	
	var step: float = resolution/delta_zoom;
	
	if (Mathf.Abs(Mathf.Round(pixel_resolution.x/step)-(pixel_resolution.x/step)) > 0.01 || Mathf.Abs(Mathf.Round(pixel_resolution.y/step)-(pixel_resolution.y/step)) > 0.01 ) {
		rounded = false;
		color = Color.red; 
	}
	
	for (var x: float = p1.x;x < (p1.x+pixel_resolution.x);x += step)
	{
		Drawing_tc.DrawLine(Vector2(x,p1.y),Vector2(x,p2.y),color,width,false,screen);
	}
	for (var y: float = p1.y;y < (p1.y+pixel_resolution.y);y += step)
	{
		Drawing_tc.DrawLine(Vector2(p1.x,y),Vector2(p2.x,y),color,width,false,screen);	
	}
	
	return rounded;
}

function draw_grid(rect: Rect,tile_x: int,tile_y: int,color: Color,width: int,screen: Rect)
{
	var step: Vector2;
	step.x = rect.width/tile_x;
	step.y = rect.height/tile_y; 
	
	for (var x: float = rect.x;x <= rect.xMax+step.x/2;x += step.x)
	{
		Drawing_tc.DrawLine(Vector2(x,rect.y),Vector2(x,rect.yMax),color,width,false,screen);
	}
	for (var y: float = rect.y;y <= rect.yMax+step.y/2;y += step.y)
	{
		Drawing_tc.DrawLine(Vector2(rect.x,y),Vector2(rect.xMax,y),color,width,false,screen);	
	}
}

function draw_scale_grid(rect: Rect,offset: Vector2,zoom: float,scale: float,color: Color,width: int,draw_center: boolean,screen: Rect)
{
	var step: float;
	
	step = zoom;
	
	var center: Vector2 = (Vector2(screen.width,screen.height)/2)+offset;
	
	var start: Vector2;
	var end: Vector2;
	
	var delta_x: float = center.x-rect.x;
	var delta_y: float = center.y-rect.y;
	
	var r_x: int = delta_x/step;
	
	r_x = delta_x-(r_x*step);
	r_x += rect.x;
	
	// if (r_x < rect.x){r_x += step;} 
	var count: int = calc_rest_value(((center.x-r_x)/step),10);
	
	if (count < 0){count = -9-count;} else {count = 9-count;}
	
	var count2: int = -((center.x-r_x)/step)+(9-count);
	
	var r_y: int = delta_y/step;
	r_y = delta_y-(r_y*step); 
	r_y += rect.y;
	// if (r_y < rect.y){r_y += step;}
	
	
	for (var x: float = r_x;x <= rect.xMax;x += step)
	{
		Drawing_tc.DrawLine(Vector2(x,rect.y),Vector2(x,rect.yMax),color,width,false,screen); 
		if (count > 9){count = 0;}
		// if (count == 0){GUI.Label(Rect(x,center.y,100,40),count2.ToString()+"km");count = 0;count2 += 10;}
		++count;
	}
	count = 0;
	count2 = 0;
	for (var y: float = r_y;y <= rect.yMax;y += step)
	{
		Drawing_tc.DrawLine(Vector2(rect.x,y),Vector2(rect.xMax,y),color,width,false,screen);	
	}
	
	// draw center
	if (draw_center) {
		Drawing_tc.DrawLine(Vector2(center.x,rect.y),Vector2(center.x,rect.yMax),color,width+2,false,screen);
		Drawing_tc.DrawLine(Vector2(rect.x,center.y),Vector2(rect.xMax,center.y),color,width+2,false,screen);	
	}
}

function calc_rotation_pixel(x: float,y: float,xx: float, yy: float,rotation: float): Vector2
{
	var delta: Vector2 = Vector2(x-xx,y-yy);
	var length: float = delta.magnitude;
	
	if (length != 0)
	{
		delta.x /= length;
		delta.y /= length;
	}
	
	var rad: float = Mathf.Acos(delta.x);
	
	if (delta.y < 0){rad = (PI*2)-rad;}
	
	rad -= (rotation*Mathf.Deg2Rad);
	
	delta.x = (Mathf.Cos(rad)*length)+xx;
	delta.y = (Mathf.Sin(rad)*length)+yy;
	
	return delta;
}

var minLatitude: double = -85.05112878;
var maxLatitude: double = 85.05112878;
var minLongitude: double = -180;
var maxLongitude: double = 180;

function clip(n: double,minValue: double,maxValue: double): double
{
	return calcMin(calcMax(n,minValue),maxValue);
}

function clip_latlong(latlong: latlong_class): latlong_class
{
	if (latlong.latitude > maxLatitude){latlong.latitude -= (maxLatitude*2);}
	else if (latlong.latitude < minLatitude){latlong.latitude += (maxLatitude*2);}
	if (latlong.longitude > 180){latlong.longitude -= 360;}
	else if (latlong.longitude < -180){latlong.longitude += 360;}
	
	return latlong;
}

function clip_pixel(map_pixel: map_pixel_class,zoom: double): map_pixel_class
{
	var mapSize: double = 256*Mathf.Pow(2,zoom);
	
	if (map_pixel.x > mapSize-1){map_pixel.x -= mapSize-1;}
	else if (map_pixel.x < 0){map_pixel.x = mapSize-1-map_pixel.x;}
	
	if (map_pixel.y > mapSize-1){map_pixel.y -= mapSize-1;}
	else if (map_pixel.y < 0){map_pixel.y = mapSize-1-map_pixel.y;}
	
	return map_pixel;
}

function calcMin(a: double,b: double): double
{
	if (a < b){return a;} else {return b;}
}

function calcMax(a: double,b: double): double
{
	if (a > b){return a;} else {return b;}
}

function mapSize(zoom: int): int
{
	return (Mathf.Pow(2,zoom)*256);
}

function latlong_to_pixel(latlong: latlong_class,latlong_center: latlong_class,zoom: double,screen_resolution: Vector2): Vector2
{
	latlong = clip_latlong(latlong);
	latlong_center = clip_latlong(latlong_center);
	
	var pi: double = 3.14159265358979323846264338327950288419716939937510;
		
	var x: double = (latlong.longitude+180)/360;
	var sinLatitude: double = Mathf.Sin(latlong.latitude*pi/180);
	var y: double = 0.5 - Mathf.Log((1+sinLatitude)/(1-sinLatitude))/(4*pi);
	
	var pixel: Vector2 = Vector2(x,y);
	
	x = (latlong_center.longitude+180)/360;
	sinLatitude = Mathf.Sin(latlong_center.latitude*pi/180);
	y = 0.5 - Mathf.Log((1+sinLatitude)/(1-sinLatitude))/(4*pi);
	
	var pixel2: Vector2 = Vector2(x,y);
	
	var pixel3: Vector2 = pixel-pixel2;
	 
	    
	pixel3 *= 256*Mathf.Pow(2,zoom);
	
	pixel3 += screen_resolution/2;
	
	return pixel3;
}	

function latlong_to_pixel2(latlong: latlong_class,zoom: double): map_pixel_class
{
	latlong = clip_latlong(latlong);
	
	var pi: double = 3.14159265358979323846264338327950288419716939937510;
		
	var x: double = (latlong.longitude+180.0)/360.0;
	var sinLatitude: double = Mathf.Sin(latlong.latitude*pi/180.0);
	var y: double = 0.5 - Mathf.Log((1.0+sinLatitude)/(1.0-sinLatitude))/(4.0*pi);
	
	x *= 256.0*Mathf.Pow(2.0,zoom);
	y *= 256.0*Mathf.Pow(2.0,zoom);
	
	var map_pixel: map_pixel_class = new map_pixel_class();
	
	map_pixel.x = x;
	map_pixel.y = y;
	
	return map_pixel;
}	

function pixel_to_latlong2(map_pixel: map_pixel_class,zoom: double): latlong_class
{
	map_pixel = clip_pixel(map_pixel,zoom);
	
	var pi: double = 3.14159265358979323846264338327950288419716939937510;
	
	var mapSize: double = 256.0*Mathf.Pow(2.0,zoom);
	
	var x: double = (map_pixel.x/mapSize)-0.5;
	var y: double = 0.5-(map_pixel.y/mapSize);
	
	var latlong: latlong_class = new latlong_class();
	
	latlong.latitude = 90.0 - 360.0*Mathf.Atan(Mathf.Exp(-y*2.0*pi))/pi;
	latlong.longitude = 360.0*x;
	
	return latlong;
}

function pixel_to_latlong(offset: Vector2,latlong_center: latlong_class,zoom: double): latlong_class 
{
	var pi: double = 3.14159265358979323846264338327950288419716939937510;
	
	var mapSize: double = 256*Mathf.Pow(2,zoom);
	
	var map_pixel_center: map_pixel_class = latlong_to_pixel2(latlong_center,zoom);
	
	var map_pixel: map_pixel_class = new map_pixel_class();
	
	map_pixel.x = map_pixel_center.x + offset.x;
	map_pixel.y = map_pixel_center.y + offset.y;
	
	var x: double = (map_pixel.x/mapSize)-0.5;
	var y: double = 0.5-(map_pixel.y/mapSize);
	
	var latlong: latlong_class = new latlong_class();
	
	latlong.latitude = 90 - 360*Mathf.Atan(Mathf.Exp(-y*2*pi))/pi;
	latlong.longitude = 360*x;
	
	latlong = clip_latlong(latlong);
	return latlong;
}

function calc_latlong_area_size(latlong1: latlong_class,latlong2: latlong_class,latlong_center: latlong_class): map_pixel_class
{
	var pi: double = 3.14159265358979323846264338327950288419716939937510;
	
	var map_p1: map_pixel_class = latlong_to_pixel2(latlong1,19);
	var map_p2: map_pixel_class = latlong_to_pixel2(latlong2,19);
	
	var map_resolution: double = 156543.04*Mathf.Cos(latlong_center.latitude*(pi/180))/(Mathf.Pow(2,19));
	
	var size: map_pixel_class = new map_pixel_class();
	size.x = (map_p2.x-map_p1.x)*map_resolution;
	size.y = (map_p2.y-map_p1.y)*map_resolution;
	
	return size;
}

function calc_latlong_area_resolution(latlong: latlong_class,zoom: double): double
{
	var pi: double = 3.14159265358979323846264338327950288419716939937510;
	
	var map_p1: map_pixel_class = latlong_to_pixel2(latlong,zoom);
	
	var map_resolution: double = 156543.04*Mathf.Cos(latlong.latitude*(pi/180))/(Mathf.Pow(2,zoom));
	
	return map_resolution;
}

function calc_latlong_area_rounded(latlong1: latlong_class,latlong2: latlong_class,zoom: double,resolution: int,square: boolean,mode: int): latlong_area_class
{
	// mode
	// 1 -> left vertical
	// 2 -> right vertical
	// 3 -> top horizontal
	// 4 -> bottom horizontal
	// 5 -> top left 
	// 6 -> top right
	// 7 -> bottom left
	// 8 -> bottom right
	
	var map_p1: map_pixel_class = latlong_to_pixel2(latlong1,zoom);
	var map_p2: map_pixel_class = latlong_to_pixel2(latlong2,zoom);
	
	var size: map_pixel_class = new map_pixel_class();
	size.x = Mathf.Round((map_p2.x-map_p1.x)/resolution)*resolution;
	if (square){size.y = size.x;}else {size.y = Mathf.Round((map_p2.y-map_p1.y)/resolution)*resolution;}
	
	
	switch (mode)
	{
		case 1: 
			if (map_p1.x > map_p2.x-resolution){map_p1.x = map_p2.x-resolution;} else {map_p1.x = map_p2.x-size.x;}
			break;
		case 2:
			if (map_p2.x < map_p1.x+resolution){map_p2.x = map_p1.x+resolution;} else {map_p2.x = map_p1.x+size.x;}
			break;
		case 3:
			if (map_p1.y > map_p2.y-resolution){map_p1.y = map_p2.y-resolution;} else {map_p1.y = map_p2.y-size.y;}
			break;
		case 4: 
			if (map_p2.y < map_p1.y+resolution){map_p2.y = map_p1.y+resolution;} else {map_p2.y = map_p1.y+size.y;}
			break;
		case 5: 
			if (map_p1.x > map_p2.x-resolution){map_p1.x = map_p2.x-resolution;} else {map_p1.x = map_p2.x-size.x;}
			if (map_p1.y > map_p2.y-resolution){map_p1.y = map_p2.y-resolution;} else {map_p1.y = map_p2.y-size.y;}
			break;
		case 6:		
			if (map_p2.x < map_p1.x+resolution){map_p2.x = map_p1.x+resolution;} else {map_p2.x = map_p1.x+size.x;}
			if (map_p1.y > map_p2.y-resolution){map_p1.y = map_p2.y-resolution;} else {map_p1.y = map_p2.y-size.y;}
			break;
		case 7:
			if (map_p1.x > map_p2.x-resolution){map_p1.x = map_p2.x-resolution;} else {map_p1.x = map_p2.x-size.x;}
			if (map_p2.y < map_p1.y+resolution){map_p2.y = map_p1.y+resolution;} else {map_p2.y = map_p1.y+size.y;}
			break;
		case 8:
			if (map_p2.x-resolution < map_p1.x){map_p2.x = map_p1.x+resolution;} else {map_p2.x = map_p1.x+size.x;}
			if (map_p2.y-resolution < map_p1.y){map_p2.y = map_p1.y+resolution;} else {map_p2.y = map_p1.y+size.y;}
			break;
	} 
	
	var area: latlong_area_class = new latlong_area_class();
	
	area.latlong1 = pixel_to_latlong2(map_p1,zoom);
	area.latlong2 = pixel_to_latlong2(map_p2,zoom);
	
	return area;
}

function calc_latlong_area_tiles(latlong1: latlong_class,latlong2: latlong_class,zoom: double,resolution: int): tile_class
{
	var tiles: tile_class = new tile_class();
	
	var map_p1: map_pixel_class = latlong_to_pixel2(latlong1,zoom);
	var map_p2: map_pixel_class = latlong_to_pixel2(latlong2,zoom);
	
	var size: map_pixel_class = new map_pixel_class();
	tiles.x = Mathf.Round((map_p2.x-map_p1.x)/resolution);
	tiles.y = Mathf.Round((map_p2.y-map_p1.y)/resolution);
	
	return tiles;
}

function calc_latlong_center(latlong1: latlong_class,latlong2: latlong_class,zoom: double,screen_resolution: Vector2): latlong_class
{
	var pixel_latlong1: map_pixel_class = latlong_to_pixel2(latlong1,zoom);
	var pixel_latlong2: map_pixel_class = latlong_to_pixel2(latlong2,zoom);
	
	var pixel_center: map_pixel_class = new map_pixel_class();
	
	pixel_center.x = (pixel_latlong1.x+pixel_latlong2.x)/2;
	pixel_center.y = (pixel_latlong1.y+pixel_latlong2.y)/2;
	
	var center: latlong_class = pixel_to_latlong2(pixel_center,zoom);
	
	return center;
}


function calc_latlong_area_from_center(area: map_area_class,center: latlong_class,zoom: double,resolution: Vector2)
{
	var pixel_old_center: map_pixel_class = latlong_to_pixel2(area.center,zoom);
	var pixel_new_center: map_pixel_class = latlong_to_pixel2(center,zoom);
	
	var pixel_latlong1: map_pixel_class = latlong_to_pixel2(area.upper_left,zoom);
	var pixel_latlong2: map_pixel_class = latlong_to_pixel2(area.lower_right,zoom);
	
	var offset: map_pixel_class = new map_pixel_class();
	
	offset.x = pixel_new_center.x-pixel_old_center.x;
	offset.y = pixel_new_center.y-pixel_old_center.y;
	
	pixel_latlong1.x += offset.x;
	pixel_latlong1.y += offset.y;  
	// pixel_latlong2.x += offset.x;
	// pixel_latlong2.y += offset.y;
	
	pixel_latlong2.x = pixel_latlong1.x+resolution.x;
	pixel_latlong2.y = pixel_latlong1.y+resolution.y;
	
	area.upper_left = pixel_to_latlong2(pixel_latlong1,zoom);
	area.lower_right = pixel_to_latlong2(pixel_latlong2,zoom);
	area.center = center;
}

function calc_latlong1_area_from_center(area: map_area_class,center: latlong_class,zoom: double)
{
	var pixel_old_latlong1: map_pixel_class = latlong_to_pixel2(area.upper_left,zoom);
	var pixel_new_latlong1: map_pixel_class = latlong_to_pixel2(center,zoom);
	
	var pixel_center: map_pixel_class = latlong_to_pixel2(area.center,zoom);
	var pixel_latlong2: map_pixel_class = latlong_to_pixel2(area.lower_right,zoom);
	
	var offset: map_pixel_class = new map_pixel_class();
	
	offset.x = pixel_new_latlong1.x-pixel_old_latlong1.x;
	offset.y = pixel_new_latlong1.y-pixel_old_latlong1.y;
	
	pixel_center.x += offset.x;
	pixel_center.y += offset.y;
	pixel_latlong2.x += offset.x;
	pixel_latlong2.y += offset.y;
	
	area.upper_left = center;
	area.center = pixel_to_latlong2(pixel_center,zoom);
	area.lower_right = pixel_to_latlong2(pixel_latlong2,zoom);
}

function calc_latlong2_area_from_center(area: map_area_class,center: latlong_class,zoom: double)
{
	var pixel_old_latlong2: map_pixel_class = latlong_to_pixel2(area.lower_right,zoom);
	var pixel_new_latlong2: map_pixel_class = latlong_to_pixel2(center,zoom);
	
	var pixel_center: map_pixel_class = latlong_to_pixel2(area.center,zoom);
	var pixel_latlong1: map_pixel_class = latlong_to_pixel2(area.upper_left,zoom);
	
	var offset: map_pixel_class = new map_pixel_class();
	
	offset.x = pixel_new_latlong2.x-pixel_old_latlong2.x;
	offset.y = pixel_new_latlong2.y-pixel_old_latlong2.y; 
	
	pixel_center.x += offset.x;
	pixel_center.y += offset.y;
	pixel_latlong1.x += offset.x;
	pixel_latlong1.y += offset.y;
	
	area.lower_right = center;
	area.center = pixel_to_latlong2(pixel_center,zoom);
	area.upper_left = pixel_to_latlong2(pixel_latlong1,zoom);
}

function calc_pixel_zoom(pixel: Vector2,zoom: double,current_zoom: double,screen_resolution: Vector2): Vector2
{
	var delta_zoom: double = Mathf.Pow(2,zoom-current_zoom);
	
	var delta_pixel: Vector2 = pixel-screen_resolution;
	delta_pixel *= delta_zoom;
	
	return (delta_pixel+screen_resolution);
}

function calc_latlong_area_by_tile(latlong: latlong_class,tile: tile_class,zoom: double,resolution: int,bresolution: Vector2): latlong_area_class
{
	var latlong_area: latlong_area_class = new latlong_area_class();
	
	var pixel: map_pixel_class = latlong_to_pixel2(latlong,zoom);
	var minus: Vector2 = Vector2(0,0);
	
	pixel.x += tile.x*resolution;
	pixel.y += tile.y*resolution;
	
	if (tile.x > 0){++pixel.x;minus.x = 1;}
	if (tile.y > 0){++pixel.y;minus.y = 1;}
	
	var latlong_temp: latlong_class = pixel_to_latlong2(pixel,zoom);
	
	latlong_area.latlong1 = latlong_temp;
	
	pixel.x += bresolution.x-minus.x;
	pixel.y += bresolution.y-minus.y; 
	
	latlong_temp = pixel_to_latlong2(pixel,zoom);
	
	latlong_area.latlong2 = latlong_temp;
	
	return latlong_area;
}

function calc_latlong_area_by_tile2(latlong: latlong_class,tile: tile_class,zoom: double,resolution: int,bresolution: Vector2): latlong_area_class
{
	var latlong_area: latlong_area_class = new latlong_area_class();
	
	var pixel: map_pixel_class = latlong_to_pixel2(latlong,zoom);
	var minus: Vector2 = Vector2(0,0);
	
	pixel.x += tile.x*(resolution);
	pixel.y += tile.y*(resolution);
	
	var latlong_temp: latlong_class = pixel_to_latlong2(pixel,zoom);
	
	latlong_area.latlong1 = latlong_temp;
	
	pixel.x += bresolution.x;
	pixel.y += bresolution.y; 
	
	latlong_temp = pixel_to_latlong2(pixel,zoom);
	
	latlong_area.latlong2 = latlong_temp;
	
	return latlong_area;
}

function calc_latlong_center_by_tile(latlong: latlong_class,tile: tile_class,subtile: tile_class,subtiles: tile_class,zoom: double,resolution: int): latlong_class
{
	var latlong_center: latlong_class = new latlong_class();
	
	var pixel: map_pixel_class = latlong_to_pixel2(latlong,zoom);
	
	pixel.x += (tile.x*subtiles.x*resolution)+(subtile.x*resolution);//-(tile.x*2);  
	pixel.y += (tile.y*subtiles.y*resolution)+(subtile.y*resolution);//-(tile.y*2);
	
	pixel.x += (resolution/2);
	pixel.y += (resolution/2); 
	
	latlong_center = pixel_to_latlong2(pixel,zoom);
	
	return latlong_center;
}

function calc_rest_value(value1: float,devide: float): int
{
	var r: int = value1/devide;
	
	r = (value1)-(r*devide);
	
	return r;
}

function calc_latlong_to_mercator(latlong: latlong_class): map_pixel_class
{
	var pixel: map_pixel_class = new map_pixel_class();
  
	pixel.x = latlong.latitude * 20037508.34 / 180;
	pixel.y = Mathf.Log(Mathf.Tan((90 + latlong.longitude) * Mathf.PI / 360)) / (Mathf.PI / 180);
	pixel.y = pixel.y * 20037508.34 / 180;
	return pixel;
} 

function calc_mercator_to_latlong (pixel: map_pixel_class): latlong_class
{
	var latlong: latlong_class = new latlong_class();
	
	latlong.longitude = (pixel.x / 20037508.34) * 180;
	latlong.latitude = (pixel.y / 20037508.34) * 180;

	latlong.latitude = 180/Mathf.PI * (2 * Mathf.Atan(Mathf.Exp(latlong.latitude * Mathf.PI / 180)) - Mathf.PI / 2);
	return latlong;
}

function rect_contains(rect1: Rect,rect2: Rect): boolean
{
	if (rect1.Contains(Vector2(rect2.x,rect2.y)) || rect1.Contains(Vector2(rect2.x,rect2.yMax)) 
		|| rect1.Contains(Vector2(rect2.xMax,rect2.y)) || rect1.Contains(Vector2(rect2.xMax,rect2.yMax))) {return true;} else {return false;}
}

function calc_terrain_tile(terrain_index: int,tiles: tile_class): tile_class
{
	var tile: tile_class = new tile_class();
	
	tile.y = terrain_index/tiles.x;
	tile.x = terrain_index-(tile.y*tiles.x);
	
	return tile;
}

#if UNITY_EDITOR
function set_image_import_settings(path: String,read: boolean,format: TextureImporterFormat,wrapmode: TextureWrapMode,maxsize: int,mipmapEnabled: boolean,filterMode: FilterMode,anisoLevel: int,mode: int)
{
	if (path.Length == 0){return;}
	path = path.Replace(Application.dataPath,"Assets");
	var textureImporter: TextureImporter = AssetImporter.GetAtPath(path) as TextureImporter;
	
	var change: boolean = false; 
	
	if (textureImporter) {
		if (mode & 1) {
			if (textureImporter.isReadable != read) {
				textureImporter.isReadable = read;
				// Debug.Log("read "+read);
				change = true; 
			}
		}
		
		if (mode & 2) {
			if (textureImporter.textureFormat != format)
			{
				textureImporter.textureFormat = format;
				change = true;
			}
		}
		
		if (mode & 4) {
			if (textureImporter.wrapMode != wrapmode)
			{
				textureImporter.wrapMode = wrapmode;
				change = true;
			}
		}
		
		if (mode & 8) {
			if (textureImporter.maxTextureSize != maxsize)
			{
				textureImporter.maxTextureSize = maxsize;
				change = true;
			}
		}
		
		if (mode & 16) {
			if (textureImporter.mipmapEnabled != mipmapEnabled) {
				textureImporter.mipmapEnabled = mipmapEnabled;
				change = true;
			}
			
		}
		
		if (mode & 32) {
			if (textureImporter.filterMode != filterMode) {
				textureImporter.filterMode = filterMode;
				change = true;
			}
			
		}
		
		if (mode & 64) {
			if (textureImporter.anisoLevel != anisoLevel) {
				textureImporter.anisoLevel = anisoLevel;
				change = true;
			}
			
		}
		
		if (change){AssetDatabase.ImportAsset(path);}
	}
	else {
		Debug.Log("Texture Importer can't find "+path);
	}
}
#endif





