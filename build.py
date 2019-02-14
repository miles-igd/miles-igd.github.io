from os import listdir, path
from json import load

def build_file_structure(pathn, parent):
    '''
    Returns a list of files at the current level with the structure
    {'parent': [file1, file2, {'folder1': [subfile1, subfile2]}, file3]}
    '''
    filesystem = []
    files = sorted(listdir(pathn))

    for file in files:
        if file.startswith('.'):
            pass
        elif path.isfile(f'{pathn}{file}'):
            filesystem.append(file)
        elif path.isdir(f'{pathn}{file}'):
            filesystem.append(build_file_structure(f'{pathn}{file}/', file))

    return {parent: filesystem}

def build_html(file_structure, pathn, dir_parent, params, parent = None):
    '''
    Builds an index.html for every file in the filesystem in dir_parent
    '''
    html = f'<h1>Index of ../{dir_parent}</h1>\n'
    if parent:
        html += f'<a href="../index.html">..</a><br/>\n'

    for file in file_structure[dir_parent]:
        if isinstance(file, dict):
            dir_name = [*file.keys()][0]
            build_html(file, f'{pathn}{dir_name}/', dir_name, params, parent = True)
            html += f'<a href="{dir_name}/index.html">{str(dir_name)[:params["limit"]]}/</b><br/>\n'
        elif file == 'index.html':
            pass
        else:
            html += f'<a href="{file}">{str(file)[:params["limit"]]}</b><br/>\n'

    with open(f'{pathn}/index.html', 'w') as file:
        file.write(html)

if __name__ == "__main__":
    with open('parameters.json', 'r') as file:
        params = load(file)

    files = build_file_structure('./', '')
    build_html(files, './', '', params)