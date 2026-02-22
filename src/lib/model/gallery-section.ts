import { Model } from "@mvc-react/mvc";
import { GalleryImage } from "../type/miscellaneous";

export interface GallerySectionModelView {
	galleryImages: GalleryImage[];
}

export type GallerySectionModel = Model<GallerySectionModelView>;
