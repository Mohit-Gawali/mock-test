import os
import re

templates_dir = "templates"
static_dir = "static"

for filename in os.listdir(templates_dir):
    if not filename.endswith(".html"): continue
    
    filepath = os.path.join(templates_dir, filename)
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    
    name = filename[:-5]
    css_file = f"{name}.css"
    js_file = f"{name}.js"
    
    css_blocks = []
    js_blocks = []
    
    # Extract <style>...</style>
    style_pattern = re.compile(r'<style>(.*?)</style>', re.DOTALL)
    for match in style_pattern.finditer(content):
        css_blocks.append(match.group(1).strip())
    content = style_pattern.sub('', content)
    
    # Extract <script>...</script> (only those without attributes or with only type="text/javascript" etc., not id="tailwind-config")
    # Actually just look for exactly <script>
    script_pattern = re.compile(r'<script>\s*(.*?)\s*</script>', re.DOTALL)
    for match in script_pattern.finditer(content):
        js_blocks.append(match.group(1).strip())
    content = script_pattern.sub('', content)
    
    # Add link and script tags if we extracted something
    # Find </head> to inject css link
    if css_blocks:
        css_content = "\n\n".join(css_blocks)
        with open(os.path.join(static_dir, css_file), "w", encoding="utf-8") as f:
            f.write(css_content)
        link_tag = f'\n<link rel="stylesheet" href="{{{{ url_for(\'static\', filename=\'{css_file}\') }}}}">'
        content = content.replace('</head>', f'{link_tag}\n</head>')
        
    # Find </body> to inject js script
    if js_blocks:
        js_content = "\n\n".join(js_blocks)
        with open(os.path.join(static_dir, js_file), "w", encoding="utf-8") as f:
            f.write(js_content)
        script_tag = f'\n<script src="{{{{ url_for(\'static\', filename=\'{js_file}\') }}}}"></script>'
        content = content.replace('</body>', f'{script_tag}\n</body>')
        
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)

print("Extraction complete.")
