import { Model } from "@mvc-react/mvc";
import { GalleryImage } from "../utilities/types";

export type GallerySectionModelView = {
	galleryImages: GalleryImage[];
};

export type GallerySectionModel = Model<GallerySectionModelView>;
