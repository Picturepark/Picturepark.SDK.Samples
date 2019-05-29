export class MobileElements {
    mobileInnerNav: HTMLElement;
    mobileSearch: HTMLElement;
    mobileMoreInfo: HTMLElement;
    mobileNavLinks: HTMLElement;
    mobileMenu: HTMLElement;
    mobileClose: HTMLElement;
    mobileBanner: HTMLElement;
    searchWrapper: HTMLElement;
    moreInfo: HTMLElement;
    navLinks: HTMLElement;

    constructor(data?: any) {
        this.mobileInnerNav = document.getElementsByClassName("mobile-inner-nav")[0] as HTMLElement;
        this.mobileSearch = document.getElementsByClassName("mobile-search")[0] as HTMLElement;
        this.mobileMoreInfo = document.getElementsByClassName("mobile-more-info")[0] as HTMLElement;
        this.mobileNavLinks = document.getElementsByClassName("mobile-nav-links")[0] as HTMLElement;
        this.mobileMenu = document.getElementsByClassName("menu-icon")[0] as HTMLElement;
        this.mobileClose = document.getElementsByClassName("mobile-nav")[0].getElementsByClassName("close-icon")[0] as HTMLElement;
        this.mobileBanner = document.getElementsByClassName("mobile-header-banner")[0] as HTMLElement;
        this.searchWrapper = document.getElementsByClassName("searchWrapper")[0] as HTMLElement;
        this.moreInfo = document.getElementsByClassName("more-info-btn")[0] as HTMLElement;
        this.navLinks = document.getElementsByClassName("nav-links")[0] as HTMLElement;
    }
}