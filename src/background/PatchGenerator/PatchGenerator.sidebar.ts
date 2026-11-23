import { FullscreenPatchGenerator, FullscreenPatchGeneratorConfig } from './PatchGenerator.fullscreen';

export class SidebarPatchGeneratorConfig extends FullscreenPatchGeneratorConfig {}

export class SidebarPatchGenerator extends FullscreenPatchGenerator<SidebarPatchGeneratorConfig> {
    protected selector = [
        // VS Code DOM (`.content` child)
        '.split-view-view > .part.sidebar > .content::after',
        // Cursor Sidebar2 DOM (no `.content` child)
        '.split-view-view > .part.sidebar > div:first-child:has(.sidebar2-compositeComponent)::after'
    ].join(', ');
}
