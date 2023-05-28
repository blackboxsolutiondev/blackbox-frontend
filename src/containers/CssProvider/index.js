import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'

import { getIsMobile } from '../../redux/theme'

export const CssProviderComponent = props => {
    const {
        children
    } = props

    return (
        <Root className={`css-provider ${props.isMobile && 'mobile'}`}>
            {children}
        </Root>
    )
}

const mapStateToProps = state => ({
    isMobile: getIsMobile(state)
})

export const CssProvider = connect(mapStateToProps)(CssProviderComponent)

const Root = styled.div`
    h1, h2, h3,
    h4, h5, h6 {
        color: ${p => p.theme.textPrimary};
    }

    p {
        color: ${p => p.theme.textMain};
    }

    label {
        color: ${p => p.theme.textPrimary};
        font-weight: 600;
        font-size: 15px;
    }

    input::placeholder {
        color: ${p => p.theme.textTertiary};
        opacity: 1;
    }
    textarea::placeholder {
        color: ${p => p.theme.textTertiary};
        opacity: 1;
    }

    input, input:active, input:focus,
    textarea, textarea:active, textarea:focus,
    select, select:active, select:focus {
        color: ${p => p.theme.textMain};
        border: 1px solid transparent;
        border-radius: 5px;
        padding: 11px 10px;
        outline: none;
        font-size: 14px;
        background-color: ${p => p.theme.bgcInput};
        margin-top: 5px;
    }

    input:focus, input:active,
    textarea:active, textarea:focus,
    select:active, select:focus {
        border-color: ${p => p.theme.tint} !important;
        background-color: transparent;
        transition: var(--duration-animation);
    }

    

    input::file-selector-button {
        border-radius: 20px;
        padding: 5px 10px;
        font: var(--font-family);
        font-weight: 700;
        outline: none;
        cursor: pointer;
        margin-right: 10px;
        border: 1px solid ${p => p.theme.bc};
        background-color: ${p => p.theme.bgcLight};
        color: ${p => p.theme.tint};
    }
    input::file-selector-button:hover {
        filter: brightness(80%);
    }

    /* Properties */

    .c-t {
        color: ${p => p.theme.tint};
    }

    .c-ts {
        color: ${p => p.theme.textSecondary};
    }

    .c-tp {
        color: ${p => p.theme.textPrimary};
    }

    .oh-dark {
        cursor: pointer;
    }
    .oh-dark:hover {
        background-color: ${p => p.theme.bgcHover};
    }

    .oh-c-t:hover {
        color: ${p => p.theme.tint};
    }

    .bgc-bgc-settings {
        background-color: ${p => p.theme.bgcSettings};
    }

    .bgc-tt {
        background-color: ${p => p.theme.tintTranslucent} !important;
    }

    /* Animations */

    @keyframes pop-in {
        0% {
            opacity: 0;
            transform: scale(0.75);
        }
        100% {
            opacity: 1;
            transform: scale(1);
        }
    }

    @-moz-keyframes pop-in {
        0% {
            opacity: 0;
            transform: scale(0.75);
        }
        100% {
            opacity: 1;
            transform: scale(1);
        }
    }

    @-webkit-keyframes pop-in {
        0% {
            opacity: 0;
            transform: scale(0.75);
        }
        100% {
            opacity: 1;
            transform: scale(1);
        }
    }

    @-o-keyframes pop-in {
        0% {
            opacity: 0;
            transform: scale(0.75);
        }
        100% {
            opacity: 1;
            transform: scale(1);
        }
    }

    @-ms-keyframes pop-in {
        0% {
            opacity: 0;
            transform: scale(0.75);
        }
        100% {
            opacity: 1;
            transform: scale(1);
        }
    }

    .animation-pop-in {
        -webkit-animation: pop-in var(--duration-animation);
        -moz-animation: pop-in var(--duration-animation);
        -ms-animation: pop-in var(--duration-animation);
        -o-animation: pop-in var(--duration-animation);
        animation: pop-in var(--duration-animation);
    }

    @keyframes slide-up {
        0% {
            transform: translateY(50px);
        }
        100% {
            transform: translateY(0px);
        }
    }

    @-moz-keyframes slide-up {
        0% {
            transform: translateY(50px);
        }
        100% {
            transform: translateY(0px);
        }
    }

    @-webkit-keyframes slide-up {
        0% {
            transform: translateY(50px);
        }
        100% {
            transform: translateY(0px);
        }
    }

    @-o-keyframes slide-up {
        0% {
            transform: translateY(50px);
        }
        100% {
            transform: translateY(0px);
        }
    }

    @-ms-keyframes slide-up {
        0% {
            transform: translateY(50px);
        }
        100% {
            transform: translateY(0px);
        }
    }

    .animation-slide-up {
        -webkit-animation: slide-up var(--duration-animation);
        -moz-animation: slide-up var(--duration-animation);
        -ms-animation: slide-up var(--duration-animation);
        -o-animation: slide-up var(--duration-animation);
        animation: slide-up var(--duration-animation);
    }

    @keyframes fade-in {
        0% {
            opacity: 0;
        }
        100% {
            opacity: 1;
        }
    }

    @-moz-keyframes fade-in {
        0% {
            opacity: 0;
        }
        100% {
            opacity: 1;
        }
    }

    @-webkit-keyframes fade-in {
        0% {
            opacity: 0;
        }
        100% {
            opacity: 1;
        }
    }

    @-o-keyframes fade-in {
        0% {
            opacity: 0;
        }
        100% {
            opacity: 1;
        }
    }

    @-ms-keyframes fade-in {
        0% {
            opacity: 0;
        }
        100% {
            opacity: 1;
        }
    }

    .animation-fade-in {
        -webkit-animation: fade-in var(--duration-animation);
        -moz-animation: fade-in var(--duration-animation);
        -ms-animation: fade-in var(--duration-animation);
        -o-animation: fade-in var(--duration-animation);
        animation: fade-in var(--duration-animation);
    }

    @keyframes animation-border-tint {
        0% {
            border-color: ${p => p.theme.tint};
        }
        25 % {
            border-color: ${p => p.theme.tintTranslucent};
        }
        75% {
            border-color: ${p => p.theme.bgcInput};
        }
        100% {
            border-color: ${p => p.theme.bgcLight};
        }
    }

    @-moz-keyframes animation-border-tint {
        0% {
            border-color: ${p => p.theme.tint};
        }
        25 % {
            border-color: ${p => p.theme.tintTranslucent};
        }
        75% {
            border-color: ${p => p.theme.bgcInput};
        }
        100% {
            border-color: ${p => p.theme.bgcLight};
        }
    }

    @-webkit-keyframes animation-border-tint {
        0% {
            border-color: ${p => p.theme.tint};
        }
        25 % {
            border-color: ${p => p.theme.tintTranslucent};
        }
        75% {
            border-color: ${p => p.theme.bgcInput};
        }
        100% {
            border-color: ${p => p.theme.bgcLight};
        }
    }

    @-o-keyframes animation-border-tint {
        0% {
            border-color: ${p => p.theme.tint};
        }
        25 % {
            border-color: ${p => p.theme.tintTranslucent};
        }
        75% {
            border-color: ${p => p.theme.bgcInput};
        }
        100% {
            border-color: ${p => p.theme.bgcLight};
        }
    }

    @-ms-keyframes animation-border-tint {
        0% {
            border-color: ${p => p.theme.tint};
        }
        25 % {
            border-color: ${p => p.theme.tintTranslucent};
        }
        75% {
            border-color: ${p => p.theme.bgcInput};
        }
        100% {
            border-color: ${p => p.theme.bgcLight};
        }
    }

    .animation-border-tint {
        -webkit-animation: animation-border-tint var(--duration-animation-long);
        -moz-animation: animation-border-tint var(--duration-animation-long);
        -ms-animation: animation-border-tint var(--duration-animation-long);
        -o-animation: animation-border-tint var(--duration-animation-long);
        animation: animation-border-tint var(--duration-animation-long);
    }

    /* Compound Properties */

    .float-container {
        border-radius: var(--br-container);
        border: ${p => p.theme.floatBorder};
        padding: none;
        overflow: hidden;
        background-color: ${p => p.theme.bgcLight};
        box-shadow: ${p => p.theme.boxShadow};
    }

    .modal-container-small,
    .modal-container-large {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: stretch;
        width: min(500px, 75vw);
        max-height: 90vh;
        overflow: scroll !important;
        background-color: ${p => p.theme.bgcLight};
        border: 1px solid ${p => p.theme.bc};
        border-radius: var(--br-container);
        overflow: hidden;
        box-sizing: border-box;
    }

    .modal-container-small {
        width: min(500px, 90vw);
        max-height: 90vh;
    }

    .modal-container-large {
        width: min(800px, 90vw);
        max-height: 90vh;
    }

    &.mobile .modal-container-small,
    &.mobile .modal-container-large {
        width: 100%;
        margin: 0px var(--ps-body);
    }

    .line-clamp-1 {
        overflow: hidden;
        text-overflow: ellipsis;
        display: block;
        /* autoprefixer: off */
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        max-height: 1 * 1.5 + unquote('em');
      }

    .line-clamp-2 {
        overflow: hidden;
        text-overflow: ellipsis;
        display: block;
        /* autoprefixer: off */
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        max-height: 2 * 1.5 + unquote('em');
    }

    .icon-clickable-small,
    .icon-clickable-medium,
    .icon-clickable-large {
        color: ${p => p.theme.textMain};
        padding: 2px 5px;
        border-radius: 5px;
        cursor: pointer;
    }

    .icon-clickable-small:hover,
    .icon-clickable-medium:hover,
    .icon-clickable-large:hover {
        color: ${p => p.theme.tint};
        background-color: ${p => p.theme.bgcHover};
    }

    .icon-clickable-small {
        font-size: 15px;
    }
    .icon-clickable-medium {
        font-size: 20px;
    }
    .icon-clickable-large {
        font-size: 30px;
    }

`