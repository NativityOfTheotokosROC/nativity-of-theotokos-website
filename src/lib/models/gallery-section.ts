import { Model } from "@mvc-react/mvc";
import { GalleryImage } from "../types/general";

export type GallerySectionModelView = {
	galleryImages: GalleryImage[];
};

export type GallerySectionModel = Model<GallerySectionModelView>;
