# YAMLSectionsExtension

A tiny extension intended to make organizing YAML files a little easier on the eyes.

Not optimized in any way. To install, build using `vsce` and install manually. 

When viewing YAML files in Visual Studio Code with the extension installed:

+ Adds collapsible sections to the code view for regions denoted by "#Section: Section name".
+ Adds these section definitions to the Outline view. 
    + Additionally, adds top level object definitions within each section as children to the Outline view.