export const browseMap = {
  componentList: {
    list: '.components-list',
    firstElement: 'div:nth-child(0n+1) .component-row'
  },
  revertButton: '[data-test-id="page-browse-buttons-bar"] [data-test-id="revert-button"]',
  contributeButton: '[data-test-id="page-browse-buttons-bar"] [data-test-id="contribute-button"]',
  contributeSuccess: '[data-test-id="contribution-success"]',
  notification: {
    revertButton: '[data-test-id="notification-revert-confirm"]'
  },
  component: {
    name: '[data-test-id="component-name"]',
    image: '.list-image',
    buttons: '.list-activity-area',
    sourceButton: '.list-fa-button > i.fa-code',
    inspectButton: '.list-fa-button > i.fa-search',
    copyButton: '.list-fa-button > i.fa-copy',
    switchButton: '.list-fa-button > i.fa-exchange-alt',
    revertButton: '.list-fa-button > i.fa-undo',
    removeButton: '.btn-link > i.list-remove',
    firstElement: '.components-list > .ReactVirtualized__Grid__innerScrollContainer > div:nth-child(1)',
    get panel() {
      return `${this.firstElement} > div.two-line-entry > div.list-panel`
    },
    get detailsElement() {
      return `${this.panel} > div`
    },
    details: {
      get declared() {
        return `${definitionsMap.component.detailsElement} > div.col-md-5 > div:nth-child(1) > div.col-md-2 > b`
      },
      get source() {
        return `${definitionsMap.component.detailsElement} > div.col-md-5 > div:nth-child(2) > div.col-md-2 > b`
      },
      get releaseDate() {
        return `${definitionsMap.component.detailsElement} > div.col-md-5 > div:nth-child(3) > div.col-md-2 > b`
      },
      get discovered() {
        return `${definitionsMap.component.detailsElement} > div.col-md-7 > div:nth-child(1) > div.col-md-2 > b`
      },
      get attribution() {
        return `${definitionsMap.component.detailsElement} > div.col-md-7 > div:nth-child(2) > div.col-md-2 > b`
      },
      get files() {
        return `${definitionsMap.component.detailsElement} > div.col-md-7 > div:nth-child(3) > div.col-md-2 > b`
      },
      licenseField: '[name="licensed.declared"] > span',
      licensePickerButton: '.license-renderer > .license-advanced',
      revertLicenseButton: '.license-renderer .fa-undo',
      get licenseFieldUpdated() {
        return `${this.licenseField}.bg-info`
      },
      sourceField: '[name="described.sourceLocation"] > .fas.fa-pencil-alt.editable-marker',
      releaseDateField: '[name="described.releaseDate"] > .fas.fa-pencil-alt.editable-marker',
      releaseDateInput: '[name="described.releaseDate"] > input'
    }
  },
  licensePicker: {
    identifier: '.spdx-picker',
    inputField: '.spdx-picker [data-test-id="spdx-input-picker"] .rbt-input-main',
    listSelection: '#rbt-menu-item-1',
    buttonSuccess: '[data-test-id="license-picker-ok-button"]'
  },
  sourcePicker: {
    identifier: '#source-picker',
    get buttonSuccess() {
      return `${this.identifier} .btn-success`
    }
  },
  fullDetailView: {
    identifier: '.fullDetaiView__modal',
    get buttonSuccess() {
      return `${this.identifier} [data-test-id="header-section-ok-button"]`
    }
  },
  contributeModal: {
    identifier: '#contribute-modal',
    get summaryField() {
      return `${this.identifier} input[name="summary"]`
    },
    get detailsField() {
      return `${this.identifier} textarea[name="details"]`
    },
    get resolutionField() {
      return `${this.identifier} textarea[name="resolution"]`
    },
    get typeField() {
      return `${this.identifier} select[name="type"]`
    },
    get contributeButton() {
      return `${this.identifier} [data-test-id="contribute-button"]`
    }
  }
}
