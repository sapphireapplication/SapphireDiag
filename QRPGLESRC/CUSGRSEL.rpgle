000100070317     F**********************************************************************    000200980821     F*�F i l e s                                                               000300980821     F**********************************************************************    000400070213     FCUSGRSLD  CF   E             WORKSTN                                      000500070201     F                                     SFILE(ZZSFL:SFLRRN)                  000600070213     FCUSGRP    IF   E           K DISK                                         000700070201     C*******************************************************************       000800070201     C*�M a i n l i n e   C o d e                                               000900070201     C*******************************************************************       001000070201     C*�Build subfile                                                           001001110922     C**                 EXSR      ZCLRLF                                       001100070201     C                   EXSR      ZBUILD                                       001101110922                                                                                001200070201     C*�Until Exit/Cancel                                                       001300070201     C     *IN03         DOWEQ     '0'                                          001400070201     C     *IN12         ANDEQ     '0'                                          001500070201     C*�Display screen                                                          001600070201     C                   EXFMT     ZZCTL                                        001700070201     C*�If Exit/Cancel                                                          001800070201     C     *IN03         IFEQ      '1'                                          001900070201     C     *IN12         OREQ      '1'                                          002000070201     C                   LEAVE                                                  002100070201     C                   ENDIF                                                  002200070201     C*�If selection made                                                       002300070201     C                   READC     ZZSFL                                  30    002400070201     C     *IN30         IFEQ      '0'                                          002500070213     C                   MOVEL     XWBNCD        PCODE                          002600070213     C                   MOVEL     XWKHTX        PARNAM                         002601110922     C**                 MOVEL     XWKSTY        PARSTS                         002700070201     C                   LEAVE                                                  002800070201     C                   ENDIF                                                  002900070201     C*�End: Until Exit/Cancel                                                  003000070201     C                   ENDDO                                                  003100070201     C*�Terminate program                                                       003200070201     C                   MOVE      '1'           *INLR                          003300070201     C                   RETURN                                                 003400070201     C*******************************************************************       003500070201     C* L o g i c a l   E n d   o f   P r o g r a m                             003600070201     C*******************************************************************       003700070201     C*******************************************************************       003800070201     C     ZBUILD        BEGSR                                                  003900070201     C******************************************************************        004000070201     C*�Subroutine: Build subfile                                               004100070201     C******************************************************************        004200070201     C                   MOVE      *ZEROS        SFLRRN            5 0          004300070213     C     *LOVAL        SETLL     CUSGRP                                       004400070213     C                   READ(N)   CUSGRP                                 31    004500070201     C     *IN31         DOWEQ     '0'                                          004501110922     C***                Z-ADD     1             SFLRRN                         004600070201     C                   ADD       1             SFLRRN                         004700070201     C                   WRITE     ZZSFL                                        004800070213     C                   READ(N)   CUSGRP                                 31    004900070201     C                   ENDDO                                                  005000070201     C     SFLRRN        IFGT      0                                            005100070201     C                   MOVE      '1'           *IN31                          005200070201     C                   ENDIF                                                  005300070201     C                   ENDSR                                                  005400070201     C*******************************************************************       005500070201     C*******************************************************************       005600050722     C*�N o n - e x e c u t a b l e   C o d e                                   005700070201     C*******************************************************************       005800050801     C*�*ENTRY Parameter List                                                   005900070201     C     *ENTRY        PLIST                                                  006000070213     C                   PARM                    PCODE             2            006100070213     C                   PARM                    PARNAM           40            006200050722     C**********************************************************************    