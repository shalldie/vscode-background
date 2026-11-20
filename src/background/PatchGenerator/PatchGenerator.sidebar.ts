import { FullscreenPatchGenerator, FullscreenPatchGeneratorConfig } from './PatchGenerator.fullscreen';

export class SidebarPatchGeneratorConfig extends FullscreenPatchGeneratorConfig {}

export class SidebarPatchGenerator extends FullscreenPatchGenerator<SidebarPatchGeneratorConfig> {
    // Classic `.content` + Cursor Sidebar2 (no `.content` child)
    protected selector =
        '.split-view-view > .part.sidebar > .content::after, .split-view-view > .part.sidebar > div:first-child:has(.sidebar2-compositeComponent)::after';
}
