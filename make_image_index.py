import os
import json

def make_image_index(search_root, path_root=None):
  if path_root is None:
    path_root = search_root

  class Indexer:
    def __init__(self):
      self.image_extension = set([".jpg"])
      self.unhandled_extensions = set()
      self.total_found = 0
      self.index = dict()
    def visit(self, dirname, filenames):
      category = os.path.relpath(dirname, search_root)
      image_files = []
      for f in filenames:
        if os.path.isdir(f):
          continue
        elif os.path.islink(f):
          print "Warning: Ignoring symbolic link: \"%s\"" % f
        else:
          extension = os.path.splitext(f)[1]
          if extension in self.image_extension:
            fullpath = os.path.join(dirname, f)
            image_files.append(os.path.relpath(fullpath, path_root))
          else:
            self.unhandled_extensions.add(extension)
      if len(image_files):
        self.index[category] = image_files
        self.total_found += len(image_files)
  indexer = Indexer()
  os.path.walk(search_root, Indexer.visit, indexer)

  ignored_extensions = set(["", ".css", ".html", ".idx", ".js", ".json", ".md", ".pack", ".py", ".sample"])
  unknown_extensions = indexer.unhandled_extensions.difference(ignored_extensions)
  if len(unknown_extensions):
    print "Warning: Ignored files with the following unhandled extension:"
    for e in sorted(unknown_extensions):
      print "\t%s" % e
  print "Found %d images in %d folders" % (indexer.total_found, len(indexer.index))
  return indexer.index


if __name__ == '__main__':
  outfile_name = "image_index.js" # Result will be written here
  search_root = "photos" # Folders in this path will be searched recursively
  path_root = "." # Output paths will be relative to this directory
  image_index = make_image_index(search_root, path_root)
  print "Writing image index to \"%s\"" % outfile_name
  open(outfile_name,"w").write("var categoryLists = %s;" % json.dumps(image_index,indent=4,sort_keys=True))
  

