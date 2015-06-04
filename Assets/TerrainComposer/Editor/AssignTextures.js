#pragma downcast

class AssignTextures extends EditorWindow
{

	var script: terraincomposer_save;
	var tc_script: TerrainComposer;
	var global_script: global_settings_tc;
	var scrollPos: Vector2;
	var rtp: boolean = false;
	
	static function ShowWindow () 
	{
    	var window = EditorWindow.GetWindow(AssignTextures);
        window.title = "Terrain Tiles";
    }
    
    function OnFocus()
	{
		Get_TerrainComposer_Scene();
	}
	
	function OnEnable()
	{
		load_button_textures();
	}
	
	function load_button_textures() 
	{
	   
	}
	
	function Get_TerrainComposer_Scene()
    {
     	TerrainComposer_Scene = GameObject.Find("TerrainComposer_Save");
     	Global_Settings_Scene = GameObject.Find("global_settings");
        
        if (TerrainComposer_Scene)
        {
        	script = TerrainComposer_Scene.GetComponent(terraincomposer_save);
        	if (script)
        	{
        		script_set = true;
        	}
        }
       	else {script_set = false;}
       	
       	if (Global_Settings_Scene)
        {
        	global_script = Global_Settings_Scene.GetComponent(global_settings_tc);
        }
        
        if (!tc_script)
		{ 
			tc_script = EditorWindow.GetWindow(TerrainComposer) as TerrainComposer;
		}
    }
    
	function OnDestroy()
	{
		if (!script){OnFocus();}
		script.image_tools = false;
		if (tc_script){tc_script.Repaint();}
	}

	function OnGUI()
	{
		if (!tc_script || !script || !global_script){OnFocus();return1 = true;}
		if (global_script.tex1 && script.settings.color.backgroundActive)
        {
	       	GUI.color = script.settings.color.backgroundColor;
	       	EditorGUI.DrawPreviewTexture(Rect(0,0,position.width,position.height),global_script.tex1);
	       	GUI.color = UnityEngine.Color.white;
	    }
	    else
	    {
	    	global_script.tex1 = new Texture2D(1,1);
	    }
		
		key = Event.current;
			    
    	EditorGUILayout.BeginHorizontal();
		if (global_script.tooltip_mode != 0)
    	{
			tooltip_text = "Auto complete the list\n(Click)\n\nSet search parameters\n(Alt Click)";
        }
        tc_script.key = Event.current;
        
		if (GUILayout.Button(GUIContent(">Auto Search",tooltip_text),GUILayout.Width(94)))
		{
			if (key.shift)
			{
				if (script.terrains[0].rtp_script) {
					if (!script.terrains[0].rtp_script.ColorGlobal) {
						this.ShowNotification(GUIContent("Please assign the first texture"));
					}
					else {
						Undo.RegisterUndo(script,"Auto Search Image");
						script.settings.colormap_auto_search.path_full = AssetDatabase.GetAssetPath(script.terrains[0].rtp_script.ColorGlobal);
						script.settings.colormap_auto_search.strip_file();
						auto_search_rtp_colormap();
					}
				}
				else {
					if (!script.terrains[0].splatPrototypes[0].texture) {
						this.ShowNotification(GUIContent("Please assign the first texture"));
					}
					else {
						Undo.RegisterUndo(script,"Auto Search Image");
						script.settings.colormap_auto_search.path_full = AssetDatabase.GetAssetPath(script.terrains[0].splatPrototypes[0].texture);
						script.settings.colormap_auto_search.strip_file();
						auto_search_colormap();
					}
				}
			}
			else
			{
				tc_script.draw_auto_search_select(script.settings.colormap_auto_search,true);
			}
		} 
		if (key.type == EventType.Repaint) 
		{
	    	script.settings.colormap_auto_search.menu_rect = GUILayoutUtility.GetLastRect();
	    }
		GUILayout.Space(10);
		script.settings.colormap_auto_search.foldout = EditorGUI.Foldout(Rect(script.settings.colormap_auto_search.menu_rect.x+95,script.settings.colormap_auto_search.menu_rect.y,15,19),script.settings.colormap_auto_search.foldout,String.Empty);
		EditorGUILayout.LabelField("("+script.settings.colormap_auto_search.output_format+") (Shift click to do the auto search)");
		EditorGUILayout.EndHorizontal();
		
		if (script.settings.colormap_auto_search.foldout)
		{
			tc_script.draw_auto_search(script.settings.colormap_auto_search,-220);
			GUILayout.Space(5);
		}
		
		var tiles: tile_class = new tile_class();
		tiles.x = script.terrains[0].tiles.x;
		tiles.y = script.terrains[0].tiles.y;
		
		scrollPos = EditorGUILayout.BeginScrollView(scrollPos,true,true);
		
		for (tile_x = 0;tile_x < tiles.x;++tile_x)
		{
			EditorGUILayout.BeginHorizontal();
			for (tile_y = 0;tile_y < tiles.y;++tile_y)
			{
				count_terrain = (tile_y*tiles.x)+tile_x;
				current_terrain = script.terrains[count_terrain];
				gui_changed_old = GUI.changed;
				GUI.changed = false;
				
				if (current_terrain.rtp_script) {
					gui_changed_old = GUI.changed;
    				GUI.changed = false;
    				current_terrain.rtp_script.ColorGlobal = EditorGUILayout.ObjectField(current_terrain.rtp_script.ColorGlobal,Texture,true,GUILayout.Width(55),GUILayout.Height(55));
    				if (GUI.changed) {
    					var path: String = AssetDatabase.GetAssetPath(current_terrain.rtp_script.ColorGlobal);
    					global_script.set_image_import_settings(path,false,TextureImporterFormat.AutomaticCompressed,TextureWrapMode.Clamp,0,true,FilterMode.Trilinear,0,20);
    					// set_image_import_settings(path: String,read: boolean,format: TextureImporterFormat,wrapmode: TextureWrapMode,maxsize: int,mipmapEnabled: boolean,filterMode: FilterMode,anisoLevel: int,mode: int)
    				}
    				GUI.changed = gui_changed_old;
				}
				else {
					if (current_terrain.splatPrototypes.Count != 0) {
						current_terrain.splatPrototypes[0].texture = EditorGUILayout.ObjectField(current_terrain.splatPrototypes[0].texture,Texture,true,GUILayout.Width(55),GUILayout.Height(55)) as Texture2D;
						if (GUI.changed)
						{
							if (tile_x == 0 && tile_y == 0)
							{
								script.settings.colormap_auto_search.path_full = AssetDatabase.GetAssetPath(current_terrain.splatPrototypes[0].texture);
							}
							tc_script.Repaint();
						}
						GUI.changed = gui_changed_old;
					} 
					else {
						GUI.color = Color.red;
						EditorGUILayout.LabelField("No Splat",GUILayout.Width(55),GUILayout.Height(55));
						GUI.color = Color.white;
					}
				}
			}
			EditorGUILayout.EndHorizontal();
		}
		EditorGUILayout.EndScrollView();
	}
	
	function auto_search_colormap()
	{
		for (var count_terrain: int = 0;count_terrain < script.terrains.Count;++count_terrain)
		{
			if (script.terrains[count_terrain].splatPrototypes.Count > 0)
			{
				path = script.settings.colormap_auto_search.get_file(script.terrains[count_terrain].tile_x,script.terrains[count_terrain].tiles.y-1-script.terrains[count_terrain].tile_z,count_terrain);
				script.terrains[count_terrain].splatPrototypes[0].texture = AssetDatabase.LoadAssetAtPath(path,Texture2D);
				
				global_script.set_image_import_settings(path,false,TextureImporterFormat.AutomaticCompressed,TextureWrapMode.Clamp,0,true,FilterMode.Trilinear,0,20);
			}
		}
		
		tc_script.Repaint();
	}
	
	function auto_search_rtp_colormap()
	{
		var path: String;
		
		for (var count_terrain: int = 1;count_terrain < script.terrains.Count;++count_terrain)
		{
			if (script.terrains[count_terrain].rtp_script)
			{
				path = script.settings.colormap_auto_search.get_file(script.terrains[count_terrain].tile_x,script.terrains[count_terrain].tiles.y-1-script.terrains[count_terrain].tile_z,count_terrain);
				script.terrains[count_terrain].rtp_script.ColorGlobal = AssetDatabase.LoadAssetAtPath(path,Texture2D);
				global_script.set_image_import_settings(path,false,TextureImporterFormat.AutomaticCompressed,TextureWrapMode.Clamp,0,true,FilterMode.Trilinear,0,20);
			}
		}
		
		tc_script.Repaint();
	}
}
   	
   