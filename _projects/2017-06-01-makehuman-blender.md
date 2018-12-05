---
title: "A tool for generating RGB and depth images of human poses"
collection: projects
permalink: /projects/2017-06-01-makehuman-blender
type: "Interdisciplinary Project"
venue: "Technical University of Munich"
date: 01-12-2017
location: "Munich, Germany"
---


This project helps you create random human poses with the help of Makehuman and then generates their rgb and depth data using Blender. The main motivation for this project was scarcity of existing datasets for human body segmentation from depth images. The data generation pipeline is capable of generating different body types and poses and thus creating a varied and large database of depth and segmented images.

Our aim is to create a labelled data set of human body that can be used for training the segmentation network. We use a coloring scheme for labelling each body part. Before rendering the RGB image each vertex of the human model is colored based on which vertex group it belongs to. There are around 164 vertex groups defined by each bone in the default skeleton that we used while creating the template in Makehuman. We manually mapped each vertex group or bone to a body part (each body part was defined by a different color).

![ATS](https://dugarsumit.github.io/images/makehuman-blender-flow.png)

In order to scale the data creation process we made the pipeline as automatic and flexible as possible. In this pipeline we are using two open source modelling and graphics softwares - Makehuman and Blender.

##	Makehuman Pipeline : Generate Random Human Models
First we manually create a base template human model using Makehuman. We save this model in .mhm format and use a default skeleton for creating this model. It is important to use the default skeleton because other skeleton models are either too detailed or lack enough information. Our script takes this template and some configuration file as input and randomly generates different variations of this template as output. The output variations are generated in .dae format.

##	Blender Pipeline : Render RGB and Depth Data
After generating the human models the next step is to render RGB and depth images for each of these models from different views. We use Blender for this step. As before our script for this step takes some configuration files and generated human models as input.

We setup a blender scene consisting of a human model, a camera and a HEMI lamp as the light source. We remove the default cube object and light source from the scene. We recreate this scene for each human model. Now for rendering RGB and depth data we fix the camera pose looking at the human model in the scene and then revolve the camera around the human model. We revolve with a step of 1 degree and for each step we render images. The position of the camera can be configured with the help of a configuration file.

[For more details read section 3.2 of this report](https://dugarsumit.github.io/files/idp-report.pdf)  
[Source Code](https://github.com/dugarsumit/makehuman_blender)